const Create = () => {
    return (
        <div className="flex flex-col h-full w-full justify-center items-center space-y-3">
            <h1 className="font-bold">Create Video</h1>
            <textarea placeholder="Enter a prompt..." className="w-96 h-96 p-3"></textarea>
            <button>Create</button>
        </div>
    )
}

export default Create