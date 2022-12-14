import { ethers } from "ethers"
import ABI from "../abis/Fundraiser.json"

export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum)
  dispatch({ type: "PROVIDER_LOADED", connection })
  return connection
}
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch({ type: "NETWORK_LOADED", chainId })
  return chainId
}
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  })
  const account = ethers.utils.getAddress(accounts[0])
  dispatch({ type: "ACCOUNT_LOADED", account })

  let balance = await provider.getBalance(account)
  balance = ethers.utils.formatEther(balance)
  dispatch({ type: "ETHER_BALANCE_LOADED", balance })

  return account
}

export const loadFundraiser = async (provider, address, dispatch) => {
  const fundraiser = new ethers.Contract(address, ABI, provider)
  dispatch({ type: "FUNDRAISER_LOADED", fundraiser })
  return fundraiser
}
export const loadContractBalance = async (fundraiser, dispatch) => {
  let balance
  balance = ethers.utils.formatUnits(await fundraiser.BalanceOf(), 18)

  dispatch({ type: "CONTRACT_BALANCE_LOADED", balance })
  return balance
}
export const loadgetPrice = async (fundraiser, dispatch) => {
  let price
  price = ethers.utils.formatUnits(await fundraiser.getPriceNeeded(), 18)

  dispatch({ type: "PRICE_NEEDED_LOADED", price })
  return price
}
export const loadgetFundname = async (fundraiser, dispatch) => {
  let name
  name = await fundraiser.getFundraiserName()

  dispatch({ type: "FUNDRAISER_NAME_LOADED", name })
  return name
}

export const loadStarter = async (
  provider,
  fundraiser,
  Name,
  amount,
  dispatch
) => {
  let starter
  const signer = provider.getSigner()
  const Amount = ethers.utils.parseEther(amount)
  dispatch({ type: "FUNDRAISER_STARTER_LOADED_REQUEST" })
  try {
    starter = await fundraiser.connect(signer).StartFundraiser(Name, Amount)

    await starter.wait()
    dispatch({ type: "FUNDRAISER_STARTER_LOADED_SUCCESS" })
  } catch (error) {
    dispatch({ type: "FUNDRAISER_STARTER_LOADED_FAIL" })
  }
  return starter
}

export const loadDeposit = async (provider, fundraiser, amount, dispatch) => {
  let transaction

  dispatch({ type: "DEPOSIT_LOADED_REQUEST" })
  try {
    const signer = await provider.getSigner()
    const Amount = ethers.utils.parseEther(amount)
    transaction = await fundraiser.connect(signer).GimmeTheMoney({
      value: Amount,
    })
    await transaction.wait()
    dispatch({ type: "DEPOSIT_LOADED_SUCCESS" })
  } catch (error) {
    dispatch({ type: "DEPOSIT_LOADED_FAIL" })
  }
}
export const loadTransfer = async (
  provider,
  fundraiser,
  addressName,
  dispatch
) => {
  let transaction
  const signer = await provider.getSigner()
  dispatch({ type: "TRANSFER_LOADED_REQUEST" })
  try {
    transaction = await fundraiser.connect(signer).TransferMoney(addressName)
    await transaction.wait()
    dispatch({ type: "TRANSFER_LOADED_SUCCESS" })
  } catch (error) {
    dispatch({ type: "TRANSFER_LOADED_FAIL" })
  }
}
export const subscribeToEvents = (fundraiser, dispatch) => {
  fundraiser.on("NewFundraiser", (_name, _amount, event) => {
    dispatch({
      type: "FUNDRAISER_STARTER_LOADED_SUCCES",
      event,
    })
  })
  fundraiser.on("Deposit", (_depositAmount, event) => {
    const deposit = event.args
    dispatch({ type: "DEPOSIT_LOADED_SUCCESS", deposit, event })
  })
}
export const loadIncreaser = async (
  provider,
  fundraiser,
  increaser,
  dispatch
) => {
  let transaction
  const amount = ethers.utils.parseEther(increaser)
  const signer = provider.getSigner()
  dispatch({ type: "INCREASER_LOADED_REQUEST" })
  try {
    transaction = await fundraiser.connect(signer).IncreaseTheFundraiser(amount)
    await transaction.wait()
    dispatch({ type: "INCREASER_LOADED_SUCCESS" })
  } catch (error) {
    dispatch({ type: "INCREASER_LOADED_FAIL" })
  }
}
