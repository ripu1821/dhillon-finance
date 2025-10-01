import { EventWebhook }  from "@sendgrid/eventwebhook";
import { ApiError } from "../utils/ApiError.js";


const {SENDGRID_WEBHOOK_SIGNATURE_KEY}= process.env

const ew = new EventWebhook();
const publicKey = ew.convertPublicKeyToECDSA(SENDGRID_WEBHOOK_SIGNATURE_KEY);
export const verifySendGridSignature = (req, res, next)=>{
     try {
    
  const signature = req.headers['x-twilio-email-event-webhook-signature'];
    const timestamp = req.headers['x-twilio-email-event-webhook-timestamp'];

    if (!signature || !timestamp) {
      throw new ApiError(401, "Missing SendGrid headers");
    }
 
    const isVerified = ew.verifySignature(publicKey, req.body, signature, timestamp);

    if (!isVerified) {
        throw new ApiError(401, "Invalid SendGrid signature");    
    }

    next();
  } catch (err) {
    
     throw new ApiError(500, "Invalid or expired token");
    
  }
}