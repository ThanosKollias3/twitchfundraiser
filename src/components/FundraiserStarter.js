import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  loadgetFundname,
  loadgetPrice,
  loadStarter,
} from "../store/interactions"

const FundraiserStarter = () => {
  const [starter, setStarter] = useState(0)
  const [fundraiserName, setFundraiserName] = useState("")

  const dispatch = useDispatch()
  const provider = useSelector((state) => state.provider.connection)
  const fundraiser = useSelector((state) => state.fundraiser.contract)
  const account = useSelector((state) => state.provider.account)
  const getPrice = useSelector((state) => state.fundraiser.FundraiserPrice)
  const getFundraiserName = useSelector(
    (state) => state.fundraiser.FundraiserName
  )
  const transferInProgress = useSelector(
    (state) => state.fundraiser.transferInProgress
  )
  const increaseraction = useSelector(
    (state) => state.fundraiser.increaseraction
  )
  const moneytransfer = useSelector((state) => state.fundraiser.moneytransfer)

  const amountHandler = (e) => {
    setStarter(e.target.value)
  }
  const nameHandler = (e) => {
    setFundraiserName(e.target.value)
  }

  const starterHandler = (e) => {
    e.preventDefault()
    loadStarter(provider, fundraiser, fundraiserName, starter, dispatch)
    console.log(fundraiserName)
    setStarter(0)
    setFundraiserName("")
  }
  useEffect(() => {
    if (fundraiser && account) {
      loadgetPrice(fundraiser, dispatch)
      loadgetFundname(fundraiser, dispatch)
    }
  }, [
    fundraiser,
    account,
    transferInProgress,
    increaseraction,
    moneytransfer,
    dispatch,
  ])
  return (
    <div className="component exchange__transfers">
      <div className="component__header flex-center">
        <div className="exchange__transfers--form">
          <div className="flex-between">
            <p>
              <small>Fundraiser Name:</small>
              <br />
              {getFundraiserName}
            </p>

            <p>
              <small>Fundraiser Price:</small>
              <br />
              {getPrice}
            </p>
          </div>
        </div>
        <form onSubmit={(e) => starterHandler(e)}>
          <label htmlFor="Starter">
            Give the Name of the Fundraiser and the Price you want to raise
          </label>
          <input
            type="text"
            id="Starter"
            placeholder="Fundraiser Name"
            value={fundraiserName === " " ? "" : fundraiserName}
            onChange={(e) => nameHandler(e)}
          />
          <input
            type="text"
            id="Starter"
            placeholder="0.0000"
            value={starter === 0 ? "" : starter}
            onChange={(e) => amountHandler(e)}
          />
          <button className="button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
export default FundraiserStarter
