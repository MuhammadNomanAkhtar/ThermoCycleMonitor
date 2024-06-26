import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ToggleButton = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={74}
        height={166.444}
        {...props}
    >
        <Path
            data-name="Icon material-menu"
            d="M0 166.444h249.667V138.7H0Zm0-69.352h249.667v-27.74H0ZM0 0v27.741h249.667V0Z"
            fill="#fff"
        />
    </Svg>
)

export default ToggleButton
