import { Card, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { SliderWithState } from "../Mint/SliderWithState";
import useNFTState from "../NFT/hooks/useNFTState";
import { useAssetBySymbol } from "@/hooks/useAssets";
import { useBalanceByAsset } from "@/hooks/useBalance";
import { TxButton } from "../TxButton";
import { isGreaterThanZero } from "@/helpers/num";
import useLiveNFTBid from "./hooks/useLiveNFTBid";
import { useLiveNFT } from "./hooks/useBraneAuction";
import { useEffect, useMemo, useState } from "react";
import React from "react";

//ipfs://bafybeibyujxdq5bzf7m5fadbn3vysh3b32fvontswmxqj6rxj5o6mi3wvy/0.png
//ipfs://bafybeid2chlkhoknrlwjycpzkiipqypo3x4awnuttdx6sex3kisr3rgfsm
//ipfs://bafkreiglpln4i7lm5lbh4b6tqo5auvmh7iboleqnadzynfdokmizvlzvu4

function removeSegmentAndBefore(input: string, segment: string): string {
  // Find the position of the segment in the input string
  const segmentIndex = input.indexOf(segment);

  // If the segment is not found, return the original string
  if (segmentIndex === -1) {
    return input;
  }

  // Calculate the position right after the segment
  const afterSegmentIndex = segmentIndex + segment.length;

  // Return the part of the string starting after the segment
  return input.substring(afterSegmentIndex);
}

//todo: 
{/* Curation pagination in v2*/}

interface Prop {
    tokenURI: string | undefined, 
    nftBidAmount: number
}

const LiveAuction = React.memo(({ tokenURI, nftBidAmount }: Prop) => {    
    console.log("LiveAuction rerender")

    // const currentNFTIPFS = "ipfs://bafybeib4imygu5ehbgy7frry65ywpekw72kbs7thk5a2zjhyw67wluoy2m/metadata/Ecto Brane"
    
    const { setNFTState } = useNFTState()
    const bid = useLiveNFTBid(nftBidAmount)

    const stargazeCDT = useAssetBySymbol('CDT', 'stargaze')
    const stargazeCDTBalance = useBalanceByAsset(stargazeCDT, 'stargaze')

    //Remove ipfs portion of link for metadata
    const ipfsString = removeSegmentAndBefore(tokenURI??"ipfs://bafybeidx45olni2oa4lq53s77vvvuuzsaalo3tlfsw7lsysvvpjl3ancfm/brane_wave.png", "ipfs://")
    //Get JSON metadata from IPFS
    const { data: liveNFT } = useLiveNFT(ipfsString)
    
    const onBidChange = (value: number) => {
        setNFTState({ nftBidAmount: value })
    }

    const [isLoading, setIsLoading] = useState("Loading image from IPFS......");
    const [imgSRC, setIMGsrc] = useState("");
    //Remove ipfs portion of link for image
    useMemo(() => {
        if (liveNFT) setIMGsrc("https://ipfs-gw.stargaze-apis.com/ipfs/" +  removeSegmentAndBefore(liveNFT.image, "ipfs://") )
            // setIMGsrc("https://ipfs-gw.stargaze-apis.com/ipfs/bafybeido64nj7ysgmpok7tpo4emos7vehfyq4rrt27cu5urdciick3ytfm")
    }, [liveNFT])

    useMemo(() => {
        const img: HTMLImageElement = document.createElement('img');
        img.src = imgSRC;
        img.onload = () => {
            setIsLoading("");
        };
    }, [imgSRC]);

    return (
        <Card w="full" p="8" alignItems="center" gap={5} h="full" justifyContent="space-between">
            {/* Need to add pagination for submissions so we can curate */}
            {isLoading && tokenURI === "Loading image from IPFS......" && <div>{isLoading}</div>}
            <HStack width="100%" justifyContent="space-between" backgroundColor="black" border="7px solid black">
            {isLoading === "Loading image from IPFS......" ? <Image
                src={"/images/brane_wave.jpg"}
                alt="Current Auctioned NFT Image"   
                style={{ display: 'block' }}
                width="18%"
                height="auto"
                borderRadius="50%"
            /> : <Image
                src={imgSRC}
                alt="Current Auctioned NFT Image"        
                style={{ display: 'block' }}
                width="18%"
                height="auto"
                borderRadius="50%"
            />}
                <HStack justifyContent="space-between" marginRight={"2"}>
                    <Text fontSize="16px" fontWeight="700">
                    {nftBidAmount}
                    </Text>
                    <Text fontSize="16px" fontWeight="700">
                    CDT
                    </Text>
                </HStack>
                <SliderWithState
                    value={nftBidAmount}
                    onChange={onBidChange}
                    min={0}
                    max={Number(stargazeCDTBalance)}
                />
                <TxButton
                    // marginTop={"3%"}
                    w="64px"
                    height="64px"
                    borderRadius="50%"
                    px="10"
                    isDisabled={!isGreaterThanZero(nftBidAmount) || bid?.action.simulate.isError || !bid?.action.simulate.data}
                    isLoading={bid.action.simulate.isPending && !bid.action.simulate.isError && bid.action.simulate.data}
                    onClick={() => bid.action.tx.mutate()}
                    chain_name="stargaze"
                    toggleConnectLabel={false}
                    >
                    Bid
                </TxButton>
            </HStack>
        </Card>
    )
})

export default LiveAuction