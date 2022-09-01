import React from "react";
import {createRoot} from "react-dom/client";
import axios from "axios";

//using fucntion to build up APP

// const App = () => {
//     const [movies, setMovies] = React.useState([]) //set the 
// }


//using class method to build the react app
class App extends React.Component{
    constructor(){
        super();
        this.state = {
            movies : []
        }; //init the state with an empty array
    }
    async componentDidMount() { // use this method to fetch data from api
        try{
            const response = await axios.get('api/movies')
            this.setState({movies: response.data})
        }catch(error){
            console.log(error)
        }
    }
    render(){
        const {movies} = this.state; //using destructing to get data to movies
        return (
            <div>
                <h1>Movie Lists</h1>
                <ul>
                    {
                        movies.map(
                            movie => {
                                return (
                                    <li key = {movie.id}>
                                        {movie.name} 
                                        {new Date(movie.updatedAt).toLocaleDateString()} 
                                        {
                                            <button disabled={movie.watched ? true : false}>watched</button>
                                        }
                                        {
                                            <button disabled={movie.notwatched ? true : false}>unwatched</button>
                                        }
                                    </li>
                                )
                            }
                        )
                    }
                </ul>
            </div>
        )
    }

}


const root = createRoot(document.querySelector('#root'))
root.render(<App />)