import { formatDate, removeHash, removeHTML, stripTimeString, today } from "./utils";

const isRunning = (status) => {
  return status === "Running" || status === "Pending";
};

const failStatus = ["Fail", "HW Error", "Warning"];
const workflowsHaveContent = (workflows) => {
  if (!workflows) return false;
  return workflows.some((workflow) => {
    workflow.contentWithoutSpaces = workflow.content.trim();
    workflow.contentWithoutHTML = removeHTML(workflow.contentWithoutSpaces);
    return workflow.contentWithoutHTML !== "" || workflow?.status?.includes(failStatus);
  });
};

const workflowsExecuted = (workflows) => {
  const executed = ["Success", "Fail", "HW Error", "Warning"];
  const executedWorkflows = workflows.filter((workflow) => {
    return executed.includes(workflow.status);
  });

  var HTMLDataString = "";

  if (executedWorkflows.length !== 0) {
    HTMLDataString += `<span class='tab' >Workflows executed:</span>`;
    HTMLDataString += "<ul>";
    executedWorkflows.forEach((workflow) => {
      HTMLDataString += "<li>";
      HTMLDataString += `<span>${workflow.workflowName}</span>`;
      HTMLDataString += "</li>";
    });
    HTMLDataString += "</ul>";
  } else {
    HTMLDataString += `<p class='tab' >No workflows executed</p>`;
  }

  return HTMLDataString;
};

const variableIsValid = (variable) => {
  variable = variable.trim();
  return variable !== undefined && variable !== null && variable !== "";
};

const format = (html) => {
  html = removeHash(html);
  html = html.replace(/<div>(<br \/>|<br>)<\/div>/g, "<br>");

  html = html.replace(/<div>/g, "");
  html = html.replace(/<\/div>/g, "<br/>");

  // remove span tags
  html = html.replace(/<span.*?>/g, "");
  html = html.replace(/<\/span>/g, "");
  // // normalize newlines
  html = html.replace(/\r?\n|\r/g, "\n");
  // // remove any leading blank lines
  html = html.replace(/^[ \t]*[\n\r]+/gm, "");
  // // remove any trailing blank lines
  html = html.replace(/[ \t]*[\n\r]+$/gm, "");
  // // remove any blank lines (between tags)
  html = html.replace(/[ \t]*[\n\r]+[ \t]*[\n\r]+/gm, "\n");
  // // remove any blank lines (at the start)
  html = html.replace(/^[ \t]*[\n\r]+/gm, "");
  // // remove any blank lines (at the end)
  html = html.replace(/[ \t]*[\n\r]+$/gm, "");

  html = html.split("\n").join("<br>");

  return html;
};

export async function sendReport(selectedItems, mailList, preview) {
  let dateofTest = "";
  mailList = mailList?.map((item) => item.name);
  var testDate;
  await selectedItems.forEach((test) => {
    dateofTest = test.dateScheduled;
    test.testName = test.testNameWithoutLink;
    test.status = test.statusWithoutFormat;
  });
  if (dateofTest === undefined || dateofTest === "" || dateofTest === "undefined") {
    selectedItems.forEach((test) => {
      dateofTest = test.dateScheduled || test.completedDate;
    });
    if (!dateofTest) {
      dateofTest = today();
    }
  }
  let toRecipients = ["3dpmjfexternalfwsupport@hp.com", "ybarra@hp.com", "javier.lagares@hp.com"];
  let ccRecipients = mailList;

  const uniqueSet = new Set(
    selectedItems?.map((element) => {
      return element.release;
    })
  );

  let subject = "Smoke test " + [...uniqueSet].toString();

  let styles = "<style>";
  // font calibri
  styles += "body { font-family: 'Calibri', sans-serif; font-size: 11pt; }";
  styles += "table { table-layout: auto; text-align: left; }";
  styles +=
    "table, th, td { padding: 7px; border-collapse: collapse;border-spacing: 0; border: 1px solid rgb(51, 65, 85) ;}";
  styles += "th { background-color: dodgerblue; color: white; text-align: center; }";
  styles += "td { text-align:center }";

  styles += "td.Success { background-color: rgb(164, 198, 57) }";
  styles += "td.Warning { background-color: orange }";
  styles += "td.Running { background-color: rgb(211,211,211); text-color: white; }";
  styles += "td.Fail { background-color: red }";
  styles += "td.HW { background-color: red }";
  styles += "td.Skipped { background-color: rgb(173,216,230) }";

  styles += "span.Success { color: green }";
  styles += "span.Warning { color: orange }";
  styles += "span.Running, span.Pending { color: gray }";
  styles += "span.Fail { color: red }";
  styles += "span.HW { color: red }";
  styles += "span.Skipped { color: rgb(173,216,230) }";

  styles += "ul, li { list-style-type: disc; font-size: 14px; }";
  styles += ".error {text-align: left; word-break: break-word; margin: auto;}";
  styles += ".tab { margin-left: 20px; line-height: 1.5; }";
  styles += "</style>";

  let HTMLDataString = "<!DOCTYPE html><html><body><div>";
  HTMLDataString += styles;
  // stripTimeString(dateofTest);
  HTMLDataString += "<p>Hi everyone,<br><br> Summary Update from " + stripTimeString(dateofTest) + ":</p>";
  +" Smoke Test: </p>";
  HTMLDataString += "<br/>";
  HTMLDataString +=
    "<table style='width: 50%;'><tr><th>Product</th><th>Machine</th><th>Release</th><th>Branch</th><th>Test Name</th><th>Status</th></tr>";

  const link = (id) => {
    return "http://smoketesttool20.bcn.rd.hpicorp.net/tests/" + id;
  };

  await selectedItems.forEach((testItem) => {
    testDate = testItem.dateScheduled;
    HTMLDataString += "<tr><td>" + testItem.product + "</td>";
    HTMLDataString += "<td>" + testItem.machine + "</td>";
    HTMLDataString += "<td>" + testItem.release + "</td>";
    HTMLDataString += "<td>" + testItem.branch + "</td>";
    HTMLDataString += "<td>" + "<a href=" + link(testItem.testId) + ">" + testItem.testName + "</a>" + "</td>";
    HTMLDataString += "<td class=" + testItem.status + ">" + testItem.status + "</td></tr>";
  });
  HTMLDataString += "</table><br>";
  HTMLDataString +=
    "To see more details, please refer to the website <a href='http://smoketesttool20.bcn.rd.hpicorp.net/tests/completed'>http://smoketesttool20.bcn.rd.hpicorp.net/tests/completed</a>" +
    "<br><br><br>";
  await selectedItems.forEach((testItem) => {
    let uniqueMachine = new Set(
      testItem.test.workflows.map((element) => {
        return element.machine;
      })
    );
    let uniqueIpAddress = new Set(
      testItem.test.workflows.map((element) => {
        return element.ip;
      })
    );

    let uniqueTrolley = new Set(
      testItem.test.workflows.map((element) => {
        return element.pbname;
      })
    );

    let machine = [...uniqueMachine].toString().replace(/,/g, ", ");
    let ipAddress = [...uniqueIpAddress].toString().replace(/,/g, ", ");
    let trolley = [...uniqueTrolley].toString().replace(/,/g, ", ");

    if (!isRunning(testItem.status)) {
      HTMLDataString += `<h3>Test: ${testItem.testName} - ${testItem.release} - <span class="${testItem.status}">${testItem.status}</span></h3>`;
      // Add item notes
      if (testItem.notes) {
        HTMLDataString += `<p><b>Notes:</b> ${testItem.notes}</p>`;
      }

      HTMLDataString += "<ul>";
      HTMLDataString += "<li><strong>IP Address:</strong> " + ipAddress + "</li>";
      HTMLDataString += "<li><strong>Machine used:</strong> " + machine + "</li>";
      HTMLDataString += "<li><strong>Trolley:</strong> " + trolley + "</li>";
      HTMLDataString += `<li>Test reported by ${testItem?.testExecutor || "NA"}</li>`;
      HTMLDataString += "</ul>";

      {
        HTMLDataString += workflowsExecuted(testItem.test.workflows);
      }
      if (workflowsHaveContent(testItem.test.workflows)) {
        const workflows = testItem.test.workflows;
        var isHeaderCreated = false;
        workflows.forEach((workflow, index) => {
          if (!isHeaderCreated) {
            HTMLDataString += "<table>";
            HTMLDataString += "<tr><th>Workflow</th><th>Session</th><th>Status</th><th>Error description</th></tr>";
            isHeaderCreated = true;
          }
          if (variableIsValid(removeHTML(workflow?.content))) {
            HTMLDataString += "<tr><td>" + workflow.workflowName + "</td>";
            HTMLDataString += "<td>" + workflow.session + "</td>";
            HTMLDataString += "<td class=" + workflow.status + ">" + workflow.status + "</td>";
            // remove all <div> and </div> from the error description
            HTMLDataString += "<td class='error'>" + format(workflow.content) + "</td></tr>";
          }
          if (index === testItem.test.workflows.length - 1) {
            HTMLDataString += "</table>";
          }
        });
      }
    }
  });

  const dotTo = toRecipients.map((element) => {
    return element + ";";
  });
  const dotCC = ccRecipients.map((element) => {
    return element + ";";
  });

  HTMLDataString += `<p style='padding-top:4px; margin-top: 4px;'>Regards,</p>`;
  HTMLDataString += "</div></body></html>";
  var emlContent = "data:message/rfc822 eml;charset=utf-8,";
  emlContent += "To: " + dotTo + "\n";
  emlContent += "Cc: " + dotCC + "\n";
  emlContent += "Subject: " + subject + "\n";
  emlContent += "X-Unsent: 1\n";
  emlContent += "Content-Type: text/html\n";
  emlContent += "\n";
  emlContent += HTMLDataString;

  if (preview) {
    var previewTitle = "<title>" + subject + "</title>";
    var blobPreview = previewTitle + HTMLDataString;
    var blob = new Blob([blobPreview], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    return window.open(url);
  }

  var encodedUri = encodeURI(emlContent);
  var a = document.createElement("a");
  var linkText = document.createTextNode("fileLink");
  a.appendChild(linkText);
  a.href = encodedUri;
  a.id = "fileLink";
  var date = new Date().toISOString();
  a.download = "SmokeTest_" + date + ".eml";
  a.style = "display:none;";
  document.body.appendChild(a);
  document.getElementById("fileLink").click();
  document.body.removeChild(a);
}

export async function ticketToMail(ticket, preview = false) {
  const subject = `FW Support request [${ticket.product}] [${ticket.team}] ${ticket.proto} ${ticket.trolley}`;

  function detectChangesOnPassedHistory(field, value) {
    if (!ticket.history) return;
    // get all the tests that have the same field and value
    const fieldHistory = ticket?.history?.filter((history) => {
      return history.field === field;
    });

    if (!fieldHistory || !fieldHistory.length) return value;

    // get the last field
    const lastField = fieldHistory[0];
    // make capital the first letter
    return `
      <span
        style="background-color: rgb(255,228,230); text-decoration: line-through;"
        >${lastField.oldValue}</span>
        <span 
        style="background-color: rgb(209, 250, 229);"
        >${value}</span>
      `;
  }

  let styles = "<style>";
  styles += "ul, li { list-style-type: disc; font-size: 14px; }";
  styles += "hr { border-bottom: 1px solid rgb(51, 65, 85);  }";
  styles += "</style>";

  let HTMLDataString = styles;
  const lastComment = ticket?.comments[ticket?.comments?.length - 1]?.comment;

  HTMLDataString += `<p>${format(lastComment)}</p>`;
  HTMLDataString += "<hr>";

  HTMLDataString += `<p><a href="smoketesttool20.bcn.rd.hpicorp.net/support/tickets/new">Create a new ticket</a></p>`;

  HTMLDataString += `FW Support team. Has recived a  new ticket. You submitted the following data:<br><br><ul>`;
  HTMLDataString += `<li> <strong>Requestor email</strong>: ${ticket.requestor}</li>`;
  HTMLDataString += `<li> <strong>Watchers</strong>: ${ticket.coworkers}</li>`;
  HTMLDataString += `<li> <strong>Team</strong>: ${detectChangesOnPassedHistory("team", ticket.team)}</li>`;
  HTMLDataString += `<li> <strong>Owner</strong>: ${ticket.testOwner}</li>`;
  HTMLDataString += `<li> <strong>Product</strong>: ${detectChangesOnPassedHistory("product", ticket.product)}</li>`;
  HTMLDataString += `<li> <strong>Proto Name</strong>: ${detectChangesOnPassedHistory("proto", ticket.proto)}</li>`;
  HTMLDataString += `<li> <strong>Release</strong>: ${detectChangesOnPassedHistory("release", ticket.release)}</li>`;
  HTMLDataString += `<li> <strong>IP Address</strong>: ${detectChangesOnPassedHistory(
    "ipAddress",
    ticket.ipAddress
  )}</li>`;
  // HTMLDataString += `<li> <strong>IP Address</strong>: ${ticket.ipAddress}</li>`;
  HTMLDataString += `<li> <strong>Session</strong>: ${detectChangesOnPassedHistory("session", ticket.session)}</li>`;
  HTMLDataString += `<li> <strong>Material</strong>: ${detectChangesOnPassedHistory("material", ticket.material)}</li>`;
  HTMLDataString += `<li> <strong>Affected System</strong>: ${detectChangesOnPassedHistory(
    "affectedSystem",
    ticket.affectedSystem
  )}</li>`;
  //   HTMLDataString += `<strong>Affected Subsystem</strong>: ${ticket.affectedSubsystem}`;
  HTMLDataString += `<li><strong>Trolley</strong>: ${detectChangesOnPassedHistory("trolley", ticket.trolley)}</li>`;
  HTMLDataString += `<li><strong>Error Description</strong>: ${ticket.errorDescription}</li>`;
  HTMLDataString += `<li><strong>MPTS</strong>: ${ticket.mpts || "-"}</li></ul><br><br>`;
  HTMLDataString += `Please verify the information and contact us if there are any mistakes.<br>`;

  HTMLDataString += `<p style='padding-top:4px; margin-top: 4px;'>Thank you!</p>`;
  HTMLDataString += "</div></body></html>";
  var emlContent = "data:message/rfc822 eml;charset=utf-8,";
  emlContent += "To: " + ticket.requestor + "\n";
  emlContent += "Cc: " + "3D MJF External FW Support <3dpmjfexternalfwsupport@hp.com>; " + ticket.coworkers + "\n";
  emlContent += "Subject: " + subject + "\n";
  emlContent += "X-Unsent: 1\n";
  emlContent += "Content-Type: text/html\n";
  emlContent += "\n";
  emlContent += HTMLDataString;

  if (preview) {
    var previewTitle = "<title>" + subject + "</title>";
    var blobPreview = previewTitle + HTMLDataString;
    var blob = new Blob([blobPreview], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    return window.open(url);
  }

  var encodedUri = encodeURI(emlContent);
  var a = document.createElement("a");
  var linkText = document.createTextNode("fileLink");
  a.appendChild(linkText);
  a.href = encodedUri;
  a.id = "fileLink";
  a.download = subject + ".eml";
  a.style = "display:none;";
  document.body.appendChild(a);
  document.getElementById("fileLink").click();
  document.body.removeChild(a);
}
