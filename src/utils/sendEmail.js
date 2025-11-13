const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "<h1>This is the Email Body</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT Email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL Testing for SES",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => { 
  const sendEmailCommand = createSendEmailCommand(
    "ankurdeploy@gmail.com",
    "ankur@pullrequest.online",
  );

  try {
    const res = await sesClient.send(sendEmailCommand);
    return res;
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };