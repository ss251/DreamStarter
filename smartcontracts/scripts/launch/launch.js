const fs = require("fs")
const { ethers, run, network } = require("hardhat")

const scripts = `scripts/launch/launch.json`
const data = fs.readFileSync(scripts, "utf8")
const jsonContent = JSON.parse(data)

let contractAddress
let blockNumber
let Verified = false

async function DreamStarterHolderDeploy() {
    const constructorParam = jsonContent.constructorParams

    const DreamStarterHolderFactory = await hre.ethers.getContractFactory("DreamStarterHolder")
    const DreamStarterHolder = await DreamStarterHolderFactory.deploy(
        constructorParam.param1,
        constructorParam.param2,
        constructorParam.param3,
        constructorParam.param4,
        constructorParam.param5,
        constructorParam.param6,
        constructorParam.param7
    )

    await DreamStarterHolder.deployed()
    console.log("DreamStarterHolder Deployed to: ", DreamStarterHolder.address)

    contractAddress = DreamStarterHolder.address
    blockNumber = DreamStarterHolder.provider._maxInternalBlockNumber
    
    /// VERIFY
    if (hre.network.name != "hardhat") {
        await DreamStarterHolder.deployTransaction.wait(6)
        await verify(DreamStarterHolder.address, [
            constructorParam.param1,
            constructorParam.param2,
            constructorParam.param3,
            constructorParam.param4,
            constructorParam.param5,
            constructorParam.param6,
            constructorParam.param7
        ])
    }
}

async function DreamStarterCollabDeploy() {
    const constructorParam = jsonContent.constructorParams
    const DreamStarterCollabFactory = await hre.ethers.getContractFactory("DreamStarterCollab")
    const DreamStarterCollab = await DreamStarterCollabFactory.deploy(
        constructorParam.param1,
        constructorParam.param2,
        constructorParam.param3,
        constructorParam.param4,
        constructorParam.param5,
        constructorParam.param6
    )
    await DreamStarterCollab.deployed()
    console.log("DreamStarterCollab Deployed to:", DreamStarterCollab.address)
    contractAddress = DreamStarterCollab.address
    blockNumber = DreamStarterCollab.provider._maxInternalBlockNumber
    /// VERIFY
    if (hre.network.name != "hardhat") {
        await DreamStarterCollab.deployTransaction.wait(6)
        await verify(DreamStarterCollab.address, [
            constructorParam.param1,
            constructorParam.param2,
            constructorParam.param3,
            constructorParam.param4,
            constructorParam.param5,
            constructorParam.param6
        ])
    }
}

async function main() {
    //DreamStarterHolder
    if (jsonContent.contractName == "DreamStarterHolder") {
        await DreamStarterHolderDeploy()
    }
    /// DreamStarterCollab CONTRACT
    if (jsonContent.contractName == "DreamStarterCollab") {
        await DreamStarterCollabDeploy()
    }

    let chainId

    if (network.config.chainId != undefined) {
        chainId = network.config.chainId
    } else {
        chainId = network.config.networkId
    }

    console.log(`The chainId is ${chainId}`)
    const data = { chainId, contractAddress, Verified, blockNumber }
    const jsonString = JSON.stringify(data)
    // Log the JSON string
    console.log(jsonString)
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        Verified = true
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
