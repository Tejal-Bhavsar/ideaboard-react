import React, { Component } from 'react'
import axios from 'axios'
import IdeaForm from './IdeaForm'
import update from 'immutability-helper'

class IdeasContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          ideas: []
        }
      }

      componentDidMount() {
        axios.get('http://localhost:3001/api/v1/ideas.json')
        .then(response => {
          console.log(response)
          this.setState({ideas: response.data})
        })
        .catch(error => console.log(error))
      }  

      addNewIdea = () => {
        axios.post(
          'http://localhost:3001/api/v1/ideas',
          { idea:
            {
              title: '',
              body: ''
            }
          }
        )
        .then(response => {
          console.log(response)
          const ideas = update(this.state.ideas, {
            $splice: [[0, 0, response.data]]
          })
          this.setState({ideas: ideas,
            editingIdeaId: response.data.id})
        })
        .catch(error => console.log(error))
      }

       

      deleteIdea = (id) => {
        axios.delete(`http://localhost:3001/api/v1/ideas/${id}`)
        .then(response => {
          const ideaIndex = this.state.ideas.findIndex(x => x.id === id)
          const ideas = update(this.state.ideas, { $splice: [[ideaIndex, 1]]})
          this.setState({ideas: ideas})
        })
        .catch(error => console.log(error))
      }


    render() {
       
      return (
        <>
        <button className="newIdeaButton"  onClick={this.addNewIdea}>
          New Idea
        </button>
        <div>
          {this.state.ideas.map((idea) => {
            if(this.state.editingIdeaId === idea.id) {
             return(<IdeaForm idea={idea} key={idea.id} />)
            } else {
            return(
              <div className="tile" key={idea.id} >
                <span className="deleteButton" onClick={() => this.deleteIdea(idea.id)} >
                    x
                </span>
                <h4>{idea.title}</h4>
                <p>{idea.body}</p>
              </div>
            ) 
            }      
          })}
      </div>
      </>
      )
    }
  }
export default IdeasContainer;