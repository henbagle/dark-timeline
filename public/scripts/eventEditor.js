function SubmitButtons(props) {
  if (props.edit === false) {
    return (<div className="my-3"><button className="btn btn-success" type="button" onClick={props.onNew}>Submit Event</button></div>);
  }

  return (
    <div className="my-3">
      <button className="btn btn-success" type="button" onClick={props.onEdit}>Submit</button>
      <button className="btn btn-danger mx-2" type="button" onClick={props.onDelete}>Delete</button>
    </div>
  );
}

function EventFormXY(props) {
  return(
  <div className="col-md-6">
    <label>{props.label}</label>
    <input type="number" name={props.field} 
    value={props.valueContainer[props.field]} 
    min="0"
    step={props.step}
    max={props.max}
    onChange={props.onChange}
    className="form-control"/>
  </div>)
}

class EventFormTextBox extends React.Component{
  // Determines if there should be a placeholder there
  shouldPlacehold(placeholder){
    const href=window.location.pathname.split("/");
    if((href[href.length-1] === "edit")){
      return("");
    }
    else{
      return(placeholder);
    }
  }

  determineTextType(){
    if(this.props.isArea){
      return(
        <textarea name={this.props.field}
          value={this.props.valueContainer[this.props.field]} 
          placeholder={this.shouldPlacehold(this.props.placeholder)} 
          onChange={this.props.onChange}
          className="form-control"/>)
    } else{
      return(
        <input type="text" name={this.props.field}
          value={this.props.valueContainer[this.props.field]} 
          placeholder={this.shouldPlacehold(this.props.placeholder)} 
          onChange={this.props.onChange}
          className="form-control"/>)
    }
  }

  render(){
    return(
      <div>
        <label>{unCamelCase(this.props.field)}: </label>
        {this.determineTextType()}
      </div>)
  }
}

class EventFormCharacters extends React.Component {
  addCharacter(i){
    const item = this.props.characters[i];
    let newArray = this.props.valueContainer.characters;
    if(!newArray.includes(item)){
      newArray.push(item);
      newArray.sort((a, b) => a.name.localeCompare(b.name))
      this.props.charChange(newArray);
    }

  }

  removeCharacter(i){
    let newArray = this.props.valueContainer.characters
    newArray.splice(i, 1);
    newArray.sort((a, b) => a.name.localeCompare(b.name))
    this.props.charChange(newArray);
  }
  
  formatName(character){
    let formattedAge = ''
    if(character.age){
      formattedAge = ` (${character.age})`;
    }
    return(character.name+formattedAge)
  }

  render(){
    const options = this.props.characters.map((val, i) => {
      return(
        <button type="button" key={val["_id"]} value={i} onClick={this.addCharacter.bind(this, i)}>{this.formatName(val)}</button>
      )
    })

    const trs = this.props.valueContainer.characters.map((val, i) => {
      return(<tr key={val["_id"]}><td>
        {this.formatName(val)}</td>
        <td><span className="floatRight" value={i} onClick={this.removeCharacter.bind(this, i)}>X</span>
      </td></tr>)
    })

    return(
    <div>
      <div>{options}</div>
      <table>
        <tbody>
          {trs}
        </tbody>
      </table>
    </div>
    )
  }

}

class EventFormPeriod extends React.Component {
  render(){
    const xLabel = "Perceived Time: "+this.props.dateyear.date
    const yLabel = "Actual Year: "+this.props.dateyear.year
    return(
      <div>
        <label>Time Period:</label>
        <select name={this.props.field} 
          value={this.props.valueContainer[this.props.field]}
          onChange={this.props.onChange}
          className="form-control">
            <option value="0">Summer 2019</option>
            <option value="1">Season 1</option>
            <option value="2">Season 2</option>
            <option value="3">Season 3</option>
          </select>
            <div className="row">
              <EventFormXY
                valueContainer={this.props.valueContainer}
                onChange={this.props.onChange} 
                field="x"
                max={this.props.dateyear.dateMax}
                step="0.01"
                label={xLabel}/>
              
              <EventFormXY
                valueContainer={this.props.valueContainer}
                onChange={this.props.onChange} 
                field="y"
                max={this.props.dateyear.yearMax}
                step="1"
                label={yLabel}/>
            </div>
      </div>
    )
  }
}

class EventFormExtraFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true
    }
    this.toggleExtras = this.toggleExtras.bind(this)
  }

  toggleExtras(){
    const newHidden = !this.state.isHidden
    this.setState({
      isHidden:newHidden
    })
  }

  render(){
    let text = "Show Extra Fields";
    if(!this.state.isHidden){
      text = "Hide Extra Fields";
    }
    return(
      <div className="my-2">
        <a className="button" onClick={this.toggleExtras} data-toggle="collapse" href="#collapseForm1">{text}</a>
        <div id="collapseForm1" className="collapse">
          <EventFormTextBox 
            valueContainer={this.props.valueContainer}
            onChange={this.props.onChange}
            field="image" 
            placeholder="Link to image of event"/>
          <EventFormTextBox 
            valueContainer={this.props.valueContainer}
            onChange={this.props.onChange} 
            field="link" 
            placeholder="Link to wiki article of event"/>
          <EventFormTextBox 
            valueContainer={this.props.valueContainer}
            onChange={this.props.onChange} 
            field="link2" 
            placeholder="Link to related event"/>
        </div>
      </div>
    )

  }

}

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    let edit;
    const href=window.location.pathname.split("/");
    edit = (href[href.length-1] === "edit");

    this.state = {
      event:{
        name: "",
        description: "",
        image: "",
        period: 1,
        methodOfTravel: "",
        location: "",
        link: "",
        link2: "",
        chartIcon: "",
        x: 1, 
        y: 3,
        characters: []
      },
      edit: edit,
      editId: (edit ? href[href.length-2] : undefined),
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCharacterChange = this.handleCharacterChange.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  handleInputChange(field){
    event = this.state.event;
    let value = field.target.value
    if(field.target.type == "number"){
      value = Number(value);
    }
    event[field.target.name] = value
    this.setState({
      event:event
    })
  }

  handleCharacterChange(array){
    let event = this.state.event;
    const newArray = array.sort((a, b) => {a.name.localeCompare(b.name)})
    event.characters = newArray;
    this.setState({
      event: event
    })
    
  }

  getDateTimelineInfo(event, periods){
    let result = {
      date: "Loading date...",
      year: "Loading year..."
    }
    if(this.state.charsLoaded){
      let episodeString=""
      const day = Math.floor(event.x)
      const date = periods[event.period].dates
      const timelines = periods[event.period].timelines

      result.dateMax = date.length-0.01
      result.yearMax = timelines.length-1
      result.year = timelines[event.y]

      try{
        if(date[day].episode){
          episodeString=" ("+date[day].episode+")"
        }
        result.date=date[day].date+episodeString
      } catch(err) {
        result.date="Value out of range"
      }
    }
    else{
      result.dateMax = 1
      result.yearMax = 4
    }
    return(result)
  }

  // Handle pressing of submit button for new event
  onNew() {
    $.ajax({
      type: "POST",
      url: "/editor/event",
      data: {event: this.state.event},
      success: (data) => {
        window.location.replace("/editor")
      },

    })
  }

  // Handle pressing of submit button for edited event
  onEdit() {
    $.ajax({
      type: "PUT",
      url: ("/editor/event/" + this.state.event["_id"]),
      data: {event: this.state.event},
      success: (data) => {
        window.location.replace("/editor")
      },

    })
  }

  onDelete(){
    $.ajax({
      type: "DELETE",
      url: ("/editor/event/" + this.state.event["_id"]),
      data: {},
      success: (data) => {
        window.location.replace("/editor")
      },

    })
  }


  componentDidMount() {
    fetch('/character').then((response) => response.json())
      .then((result) => {
        this.setState({
          charsLoaded: true,
          characters: result.chars,
          periods: result.periods
        });
      }, (error) => {
        this.setState({
          charsLoaded: true,
          error,
        });
    });

    if(this.state.edit){
      fetch('/event/'+this.state.editId).then((response) => response.json())
        .then((result) => {
          this.setState({
            editEventLoaded:true,
            event:result,
          })
        }, (error) => {
          this.setState({
            editEventLoaded:true,
            error
          })
        })
    }
  }

  render() {
    let title = 'Event Editor';
    if (this.state.editEventLoaded) {
      title = this.state.event.name;
    }

    let characterSection = <p>Loading characters...</p>
    if (this.state.charsLoaded) {
      characterSection = <EventFormCharacters
          valueContainer={this.state.event}
          characters={this.state.characters}
          charChange={this.handleCharacterChange}
          />
    }
    return (
      <form>
        <h2 className="my-2 text-center">{title}</h2>
        <div className="form-group">
          <EventFormTextBox 
          valueContainer={this.state.event}
          onChange={this.handleInputChange} 
          field="name" 
          placeholder="Jonas finds map"/>

          <EventFormTextBox 
          valueContainer={this.state.event}
          onChange={this.handleInputChange} 
          field="description" 
          placeholder="Jonas finds the map in the attic"
          isArea={true}/>

          <EventFormTextBox 
          valueContainer={this.state.event}
          onChange={this.handleInputChange} 
          field="methodOfTravel" 
          placeholder="Stairs"/>

          <EventFormTextBox 
          valueContainer={this.state.event}
          onChange={this.handleInputChange} 
          field="location" 
          placeholder="Kahnwald Residence"/>

          <EventFormExtraFields
          valueContainer={this.state.event}
          onChange={this.handleInputChange} />

          <EventFormPeriod
          valueContainer={this.state.event}
          onChange={this.handleInputChange} 
          field="period"
          dateyear={this.getDateTimelineInfo(this.state.event, this.state.periods)}
           />

          {characterSection}

          <SubmitButtons edit={this.state.edit} onNew={this.onNew} onEdit={this.onEdit} onDelete={this.onDelete} />
        </div>
      </form>
    );
  }
}

ReactDOM.render(
  <EventForm />,
  document.getElementById('root'),
);

function unCamelCase(str){
  return (str
      // insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase(); }))
}