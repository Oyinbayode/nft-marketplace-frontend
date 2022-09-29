import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEM = gql`
    {
        activeItems(first: 5, where: { buyer: null }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export default function GraphExample() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEM)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <div>
            <h1>Graph Example</h1>
            <p>Check the console for the data</p>
        </div>
    )
}
