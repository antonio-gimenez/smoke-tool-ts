import api from "../services/use-axios";

// Converts an ArrayBuffer to a Base64-encoded string
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Generates an email report with attachments
export async function generateReport(selectedItems) {
  try {
    // Get the files from the selected items
    const files = await Promise.all(
      selectedItems?.map(async (item) => {
        if (item.files?.length > 0) {
          const response = await api.get(`/tests/files/${item._id}`);
          return response.data.data;
        }
      })
    );

    // Filter out empty files and convert them to attachments
    const filteredFiles = files.flat().filter((file) => file);
    let attachments = [];

    if (filteredFiles.length) {
      attachments = await Promise.all(
        filteredFiles.map(async (file) => {
          try {
            const { data, name } = file;
            const encodedData = arrayBufferToBase64(data);
            return {
              filename: name,
              data: encodedData,
            };
          } catch (error) {
            console.error("Error encoding file:", error);
            throw new Error("Failed to encode file");
          }
        })
      );
    }

    const subject = "Email with attachments";
    const body = "This is the body of the email.";
    const from = "sender@example.com";
    const to = "recipient@example.com";

    const boundary = "my-multipart-boundary";
    const multipartContent = [
      `Content-Type: text/plain\r\n\r\n${body}\r\n`,
      ...attachments.map((attachment) => {
        if (!attachment) return "";
        const { filename, data } = attachment;
        return (
          `--${boundary}\r\n` +
          `Content-Type: application/octet-stream\r\n` +
          `Content-Disposition: attachment; filename="${filename}"\r\n` +
          `Content-Transfer-Encoding: base64\r\n\r\n` +
          `${data}\r\n`
        );
      }),
      `--${boundary}--\r\n`,
    ].join("");

    const emailContent =
      `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\n` +
      `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n${multipartContent}`;

    const emlContent = `data:application/octet-stream;base64,${btoa(emailContent)}`;

    const encodedUri = encodeURI(emlContent);
    const a = document.createElement("a");
    const linkText = document.createTextNode("fileLink");
    a.appendChild(linkText);
    a.href = encodedUri;
    a.id = "fileLink";
    a.download = "report.eml";
    a.style = "display:none;";
    document.body.appendChild(a);
    document.getElementById("fileLink").click();
    document.body.removeChild(a);

    return true; // indicate success
  } catch (error) {
    console.error("Error sending report:", error);
    return false; // indicate failure
  }
}

export async function generateReportWithAttachments(selectedItems) {
  try {
    const result = await generateReport(selectedItems);
    if (result) {
      return { type: "success", message: "Report generated successfully" };
    } else {
      throw new Error("Failed to generate report");
    }
  } catch (error) {
    console.error("An error occurred while sending the report:", error);
    return { type: "error", message: `An error occurred while sending the report: ${error}` };
  }
}
