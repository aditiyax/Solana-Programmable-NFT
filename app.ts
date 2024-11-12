import { Connection, Keypair, PublicKey} from "@solana/web3.js"; 
import {Metaplex, keypairIdentity, irysStorage} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import secret from './guideSecret.json';    

const RPC = "https://api.devnet.solana.com";
const conn = new Connection(RPC);

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
const METAPLEX = Metaplex.make(conn)
             .use(keypairIdentity(WALLET))
             .use(
                irysStorage({
                  address: "https://devnet.irys.xyz",
                  providerUrl: "https://api.devnet.solana.com",
                  timeout: 60000, }));

                 const NFT_CONFiG ={ imgName: 'MyNFT1',
                     symbol:"ADD",
                      sellerFeeBasisPoints: 500, //5% Fee
                    creators: [{ address: WALLET.publicKey, share:100}], 
                    metadata: 'https://arweave.net/h76C9QAKdXjAjwxTujcUN2IIC-Jz_xAPhN-rRzXlAbo',
                };

                    async function mintProgrammableNFT(
                        metadataUri : string,
                        name: string,
                        sellerFee: number,
                        symbol: string,
                        creators: {address: PublicKey, share: number} []) {
                            console.log("Minting pNFT...");
                            try{
                                const transactionBuilder = await METAPLEX.nfts().builders().create({
                                    uri: metadataUri,
                                    name: name,
                                    sellerFeeBasisPoints: sellerFee,
                                    symbol : symbol,
                                    creators: creators,
                                    isMutable: true,
                                    isCollection : false,
                                    tokenStandard: TokenStandard.ProgrammableNonFungible,
                                    ruleSet: null,
                                });
                                let { signature, confirmResponse} = await METAPLEX.rpc().sendAndConfirmTransaction(transactionBuilder);
                            if(confirmResponse.value.err){
                                throw new Error('Failed to confirm transaction');
                            }
                            const {mintAddress} = transactionBuilder.getContext();
                            console.log(`Success!`);
                            console.log(`Minted NFT :https://explorer.solana.com/address/${mintAddress.toString()}?cluster=devnet`);
                            console.log(` Tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
                            } 
                            catch(err) {
                                console.log(err);
                            }
                        }

                        mintProgrammableNFT(NFT_CONFiG.metadata, NFT_CONFiG.imgName,
                            NFT_CONFiG.sellerFeeBasisPoints, NFT_CONFiG.symbol, NFT_CONFiG.creators
                        );

