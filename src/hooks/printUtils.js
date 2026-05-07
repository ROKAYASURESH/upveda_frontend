export const printContent = (contentRef, options = {}) => {
  const { title = "Print Document", customStyles = "" } = options;

  return new Promise((resolve, reject) => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow pop-ups to print");
      }

      const defaultStyles = `
        @media print {
          body { 
            margin: 0; 
            padding: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          th, td { 
            padding: 8px; 
            border: 1px solid #ddd; 
          }
        }
      `;

      const combinedStyles = `
        <style>
          ${defaultStyles}
          ${customStyles}
        </style>
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            ${combinedStyles}
          </head>
          <body>
            ${contentRef.current.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        printWindow.onafterprint = () => {
          printWindow.close();
          resolve();
        };

        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
            resolve();
          }
        }, 1000);
      };
    } catch (error) {
      reject(error);
    }
  });
};
