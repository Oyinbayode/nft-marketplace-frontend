import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralis, useMoralisQuery } from "react-moralis"
import NFTBox from "../components/NFTBox"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        // TableName
        // Function for the query
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )
    console.log(listedNfts)

    return (
        <div className="container mx-auto">
            <hi className="py-4 px-4 font-bold text-2xl ">Recently Listed</hi>
            <div className="grid grid-cols-3 gap-4">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => {
                            console.log(nft.attributes)
                            const { tokenId, price, nftAddress, marketplaceAddress, seller } =
                                nft.attributes
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
