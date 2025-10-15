import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const clientId = process.env.THIRDWEB_CLIENT_ID;
const secretKey = process.env.THIRDWEB_SECRET_KEY;

if (!clientId) {
  throw new Error("No client ID provided");
}

if (!secretKey) {
  throw new Error("No secret key provided");
}

export const thirdwebClient = createThirdwebClient({
    clientId: clientId,
    secretKey: secretKey,
});

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "facebook",
        "telegram",
        "email",
        "x",
        "passkey",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];