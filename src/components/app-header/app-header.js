import { Component } from "react"
import './app-header.scss'

class AppHeader extends Component {

render(){

return(
    <header>
    <div className="header-block">
        <form  
        onSubmit={this.props.coords}
        action=""
        name= 'city'
        >
        <input   className= "header-input form-control" type="text" name="city" id="" placeholder="Город"  />
        <button className="btn btn-outline-light"> Найти </button>
        </form>
    
    </div>

</header>
)  
}
}

export default AppHeader;