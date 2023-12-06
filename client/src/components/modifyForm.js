import React, { useState, useEffect } from 'react'

const ModifyForm = ({entryId, type, setPage}) => {

    //get entry by id and by type, grab currentText

    const [newText, setNewText] = useState(currentText);

    const handleTextChange = (e) => {
        setNewText(e.target.value)
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        //route to update text based on question/answer/tag
        setPage("userPage")
    };

    const handleDelete = () => {
        //route to delete entry based on Id question/answer/tag
        setPage("userPage")
    };

  return (
    <div>
        <form>
            <div>
                <label htmlFor="text">Edit {type}:</label>
                <input
                type="text"
                id="text"
                value={newText}
                onChange={handleTextChange}
                />
            </div>
            <div>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </form>
    </div>
  )
}

export default ModifyForm