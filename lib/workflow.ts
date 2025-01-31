import { Client as WorkflowClient } from "@upstash/workflow";
import config from "./config";
import emailjs from "@emailjs/browser";

const { qstachToken, qstashUrl, resendToken } = config.env.upstach;
export const workflowClient = new WorkflowClient({
  baseUrl: qstashUrl,
  token: qstachToken,
});
export const sendEmail = async ({
  email,
  subject,
}: {
  email: string;
  subject: string;
}) => {
  const templateParams = {
    name: email,
    notes: subject,
  };
  await emailjs.send("service_jovns7l", "template_jcvctlb", templateParams, {
    publicKey: resendToken,
  });
};
