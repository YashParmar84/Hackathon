const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const categoryMap = {
  1: 'Food',
  2: 'Shopping',
  3: 'Gas',
  4: 'Bills',
  5: 'Travel',
  6: 'Groceries',
  7: 'Entertainment',
  8: 'Health',
  9: 'Phone/Internet',
  10: 'Other'
};

const generatePDF = async (userName, expenses) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `${userName.replace(/\s/g, '')}_expense_${Date.now()}.pdf`;
    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text(`Weekly Expense Report for ${userName}`, { align: 'center' });
    doc.moveDown();

    expenses.forEach((e, idx) => {
      const readableCategory = categoryMap[e.category] || 'Unknown';
      doc.fontSize(12).text(
        `${idx + 1}. ${e.name} | ₹${e.amount} | ${readableCategory} | ${e.recipent} | ${e.type} | ${new Date(e.date).toLocaleDateString()}`
      );
    });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', (err) => reject(err));
  });
};

module.exports = generatePDF;
