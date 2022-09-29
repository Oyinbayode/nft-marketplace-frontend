import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralis, useMoralisQuery } from "react-moralis"
import NFTBox from "../components/NFTBox"
import { useQuery } from "@apollo/client"
import networkMapping from "../constants/networkMapping.json"
import { GET_ACTIVE_ITEMS } from "../constants/subgraphQueries"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"

    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl ">Recently Listed</h1>
            <div className="grid grid-cols-3 gap-4">
                {isWeb3Enabled ? (
                    loading ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            console.log(nft)
                            const { tokenId, price, nftAddress, seller } = nft
                            return (
                                <div
                                    key={nft.id}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <NFTBox
                                        tokenId={tokenId}
                                        price={price}
                                        nftAddress={nftAddress}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Please connect your wallet</div>
                )}
            </div>
        </div>
    )
}
