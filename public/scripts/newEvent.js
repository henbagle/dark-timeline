function EventFormCharList(props) {
  const rows = props.chars.map((value, i) => {
    let formattedAge = "";
    if(value.age){
      formattedAge = "("+ value.age +")";
    }
    return(
    <tr key={value._id}><th>{value.name} {formattedAge}</th></tr>
    );
  })
  return rows;
}

function SubmitButtons(props){
  if(props.edit === false){
    return(<div><button className="btn btn-success" type="button" onClick={props.onNew}>Submit Event</button></div>)
  }
  else{
    return(
      <div>
      <button className="btn btn-success" type="button" onClick={props.onNew}>Submit</button>
      <button className="btn btn-danger" type="button">Delete</button>
      </div>
    )
  }
}

class EventForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      event:{
        name:"Alden"
      },
      edit: false,
    };
  }
  onNew(){  // Handle pressing of submit button for new event
    return(null);
  }
  onEdit(){ // Handle pressing of submit button for edited event
    return(null);
  }

  componentDidMount() {
    fetch("/character").then(response => response.json())
    .then((result) => {
      this.setState({
        charsLoaded: true,
        characters: result.chars,
      })
    }, (error) => {
      this.setState({
        charsLoaded: true,
        error
      })
    })
  }
  
  render(){ 
    let title = "New Event"
    if(this.state.edit){
      title = this.state.event.name
    }

    let list = <tr><th>Loading Characters...</th></tr>
    if(this.state.charsLoaded){
      list = <EventFormCharList chars={this.state.characters} />
    }
    return(
      <form>
        <h2 className="my-2 text-center">{title}</h2>
        <table>
          <tbody>
            {list}
          </tbody>
        </table>
        <SubmitButtons edit={this.state.edit} onNew={()=>this.onNew} onEdit={()=>this.onEdit} />
      </form>
    )
  }
}

ReactDOM.render(
    <EventForm />,
    document.getElementById('root')
  );