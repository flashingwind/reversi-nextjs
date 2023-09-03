type CellProps = {
    x: number
    y: number
}

const Cell = ({  x, y }: CellProps) => {
    return (
        <td>●</td>
    )
}

export default Cell
