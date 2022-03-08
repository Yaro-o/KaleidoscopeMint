import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import blockchainReducer from "./redux/blockchain/blockchainReducer";
 
const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

  export const StyledButton = styled.button`
  padding: 5px;
  border-radius: 50px;
  text-decoration: underline;
  border: none;
  background-color: var(--secondary-text);
  padding: 5px;
  font-weight: bolder;
  font-size: 15px;
  color: var(--secondary);
  width: 80px;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--secondary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;
  
export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  @media (max-width: 200px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 250px;
  @media (min-width: 767px) {
    width: 250px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const StyledImgBottom = styled.img`


  border: 18px;
  border-color: #000000;
  border-radius: 20px;
  width: 20%;
  min-width: 300px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click MINT to mint your NFT`);
  const [mintAmount, setMintAmount] = useState(1);
  
  const [backgroundcolor, setbackgroundcolor] = useState('black');
  const [strokecolor, setlstrokecolor] = useState('gold');
  const [numberofmirrors, setnumberofmirrors] = useState(20);
  const [numberofpoints, setnumberofpoints] = useState(10);
  const [strokewidth, setstrokewidth] = useState(4);
  const [opacity, setopacity] = useState(1);
  const [cropped, setcropped] = useState('false');

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(numberofpoints,
        numberofmirrors,
        strokecolor,
        backgroundcolor,
        strokewidth,
        opacity,
        (cropped.trim() === 'yes'))
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary-text)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/01.svg" : null}
      >
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "white",
              padding: 24,
              opacity: 0.8,
              borderRadius: 24,
              maxWidth: 400,
              
              
            }}
          >

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Kaleidoscope NFTs
            </s.TextTitle>

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.numTokensMinted} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>

            <span
              style={{
                textAlign: "center",
              }}
            >
              <StyledButton
                onClick={(e) => {
                  window.open("https://twitter.com/PeriodNFTs", "_blank");
                }}
                style={{
                  margin: "0px",
                  width: "60px",
                }}
              >
                Twitter
              </StyledButton>
              ∙
              <StyledButton
                style={{
                  margin: "0px",
                  width: "85px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton>
              ∙

              <StyledButton
                style={{
                  margin: "0px",
                  width: "75px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.SCAN_LINK, "_blank");
                }}
              >
                Contract
              </StyledButton>

            </span>
            <s.SpacerSmall />
            {Number(data.numTokensMinted) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)", fontWeight: "bold"}}
                >
                  Mint is FREE
                </s.TextTitle>
                
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Maximum three mints per wallet. 
                </s.TextTitle>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Please do not bypass this limit.
                </s.TextTitle>
                <s.SpacerSmall /><s.SpacerSmall />
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)", fontWeight: "bold" }}
                >
                  Customize your NFT:
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Color inputs can be any color accepted by HTML such as Black, Aqua, #DEB887, etc.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Number of Mirrors, any of the following numbers: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, or 36.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Number of Points should be any integer from 1 to a maximum of 50.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Stroke Width should be any integer from 1 to 10.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Opacity should be any decimal from 0.5 to 1.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Cropped should be yes or no (lower case).
                </s.TextDescription>
                <s.Container
                            jc={"center"}
                            ai={"center"}
                            style={{
                              backgroundColor: "white",
                              padding: 24,
                              }}>
                                                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)", fontWeight: "bold" }}
                >
                  Mint Attributes:
                </s.TextDescription>
                  <input type="text" placeholder="Background Color" onChange={e => setbackgroundcolor(e.target.value)} />
                  <s.SpacerTiny />
                  <input type="text" placeholder="Stroke Color" onChange={e => setlstrokecolor(e.target.value)} />
                  <s.SpacerTiny />
                  <input type="number" placeholder="Number of Mirrors" onChange={e => setnumberofmirrors(e.target.value)} />
                  <s.SpacerTiny />
                  <input type="number" placeholder="Number of Points" onChange={e => setnumberofpoints(e.target.value)} />
                  <s.SpacerTiny />
                  <input type="number" placeholder="Stroke Width" onChange={e => setstrokewidth(e.target.value)} />
                  <s.SpacerTiny />
                  <input type="number" placeholder="Opacity" onChange={e => setopacity(e.target.value)} />
                  <s.SpacerTiny />
                  <input type="text" placeholder="Copped" onChange={e => setcropped(e.target.value)} />
                </s.Container>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                      style={{
                        margin: "0px",
                        width: "85px",
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerLarge />
          </s.Container>
        </ResponsiveWrapper>
      </s.Container>
    </s.Screen>
  );
}

export default App;
