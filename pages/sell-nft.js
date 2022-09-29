import { ethers } from "ethers"
import { Form, useNotification, Button } from "web3uikit"
import styles from "../styles/Home.module.css"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, isWeb3Enabled, account } = useMoralis()

    const chainString = chainId ? parseInt(chainId).toString() : "31337"

    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const [proceeds, setProceeds] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const approveAndList = async (data) => {
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult

        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onError: (error) => {
                alert(error)
            },
            onSuccess: (tx) => {
                console.log(tx)
                handleApproveSuccess(nftAddress, tokenId, price)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onError: (error) => {
                alert(error)
            },
            onSuccess: (tx) => {
                console.log(tx)
                handleListSuccess()
            },
        })

        async function handleListSuccess() {
            dispatch({
                type: "success",
                message: "Item listed successfully",
                position: "topR",
            })
        }
    }

    const handleWithdrawSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => alert(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            setupUI()
        }
    }, [proceeds, isWeb3Enabled, chainId, account])

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "Nft Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token Id",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="sell-nft"
            />
            <div>Withdraw {ethers.utils.formatUnits(proceeds, "ether")} ETH proceeds</div>
            {proceeds != "0" ? (
                <Button
                    onClick={() => {
                        runContractFunction({
                            params: {
                                abi: nftMarketplaceAbi,
                                contractAddress: marketplaceAddress,
                                functionName: "withdrawProceeds",
                                params: {},
                            },
                            onError: (error) => console.log(error),
                            onSuccess: handleWithdrawSuccess,
                        })
                    }}
                    text="Withdraw"
                    type="button"
                />
            ) : (
                <div>No proceeds detected</div>
            )}
        </div>
    )
}
