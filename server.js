const express = require('express');
const path = require('path')
const pg = require('pg')
const Sequelize = require('sequelize')
const {UUID, UUIDV4, STRING, BOOLEAN, VIRTUAL} = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers-choice-spa-react')

const Movie = conn.define('movie', {
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
        validate:{
        notEmpty: true
      }
    },
    releaseyear: {
      type: STRING,
      allowNull: false
    },
    director: {
      type: STRING,
      allowNull: false
    },
    watched: {
      type: BOOLEAN,
      defaultValue: false
    },
    notwatched: {
      type: VIRTUAL,
      get: function() {
        return !this.watched
      }
    }
  }
)

const seedAndSync = async() => {
    try{
        await conn.sync({force:true})
        let movies = [
            {
              name: 'Jigsaw',
              releaseyear: '2017',
              director:'Michael Spierig, Peter Spierig',
              watched: true,
            },
            {
              name: 'Taken 3',
              releaseyear: '2015',
              director:'Olivier Megaton',
              watched: true,
            },
            {
              name: 'Top Gun: Maverick',
              releaseyear: '2022',
              director:'Joseph Kosinski',
            },
            {
              name: 'Operation Red Sea',
              releaseyear: '2018',
              director:'Dante Lam',
              watched: true,
            }
          ];
        await Promise.all(
            movies.map(movie => Movie.create(movie))
        )
    }catch(error){
        console.log(error)
    }
}

const app = express();
app.use('/dist', express.static('dist'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/api/movies', async(req, res, next) => {
    try{
        res.send(await Movie.findAll())
    }catch(error){
        next(error)
    }
})

const init = async() => {
    try{
        await seedAndSync()
        const port = process.env.PORT || 3000;
        app.listen(port, () => { console.log(`listening on port ${port}`) })
    }catch(error){
        console.log(error)
    }
};

init();