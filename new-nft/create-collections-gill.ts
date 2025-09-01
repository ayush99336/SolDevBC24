import {
  createNft,
  fetchAllDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import fs from "fs";
import {
  airdropFactory,
  getExplorerLink,
  createSolanaClient,
  LAMPORTS_PER_SOL,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  devnet,
  Address,
  lamports,
  address,
} from "gill";
import { loadKeypairFromFile, loadKeypairSignerFromFile } from "gill/node";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner } from "@metaplex-foundation/umi";

const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient(
  {
    urlOrMoniker: devnet("https://api.devnet.solana.com"),
  }
);
const af = airdropFactory({ rpc, rpcSubscriptions });
const user = await loadKeypairSignerFromFile();
const keypairPath = `${process.env.HOME}/.config/solana/id.json`;
const secretKey = Uint8Array.from(
  JSON.parse(fs.readFileSync(keypairPath, "utf8"))
);
console.log("User Secret Key:", secretKey);
let balance = await rpc.getBalance(user.address).send();
console.log("User Balance:", balance.value, "SOL");
// await rpc
//   .requestAirdrop(user.address, lamports(BigInt(2 * LAMPORTS_PER_SOL)))
//   .send();
// balance = await rpc.getBalance(user.address).send();
// console.log("User Updated Balance:", balance.value, "SOL");

console.log("User Address:", user.address);
const umi = createUmi(devnet("https://api.devnet.solana.com"));
umi.use(mplTokenMetadata());
const umiUser = umi.eddsa.createKeypairFromSecretKey(secretKey);

console.log("SetUp Umi Instance for User");
const collectionMint = generateSigner(umi);
