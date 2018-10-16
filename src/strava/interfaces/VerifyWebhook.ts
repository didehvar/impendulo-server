export default interface VerifyWebhook {
  hubMode: 'subscribe';
  hubVerifyToken: string;
  hubChallenge: string;
}
