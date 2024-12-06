import * as OTPAuth from "otpauth";

export const getOTP = async () => {
    const totp = new OTPAuth.TOTP({
        issuer: "ACME",
        label: "AzureDiamond",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: process.env.GOOGLE_AUTH_KEY
    });

    return totp.generate();
};