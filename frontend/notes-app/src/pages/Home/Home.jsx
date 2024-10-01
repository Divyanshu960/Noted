import React, { useState,useEffect } from 'react'; // Added useState import
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from  '../../assets/images/add-notes.svg';
import NoDataImg from '../../assets/images/no-data.svg';;

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

    const[allNotes,setAllNotes] = useState([])
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();
    const [showToastMsg,setShowToastMsg] = useState({
      isShown: false,
      message: "",
      type: "add",
    });

    const handleEdit = (noteDetails) => {
      setOpenAddEditModal({isShown:true,data:noteDetails,type:"edit"});
    };

    const showToastMessage = (message,type)=>{
      setShowToastMsg ({
        isShown: true,
        message,
        type,
    });
    }
    const handleCloseToast = () => {
      setShowToastMsg ({
        isShown: false,
        message: "",
    });
  };


    // GET USER INFO
    const getUserInfo = async () =>{
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user){
          setUserInfo(response.data.user);
        } 
      }
      catch(error){ 
        if(error.response.status === 401 ){
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    //GET ALL NOTES

    const getAllNotes = async () => {
        try {
          const response = await axiosInstance.get("/get-all-notes");
          if (response.data && response.data.notes){
            setAllNotes(response.data.notes);
          }
        }
        catch(error){
          console.log("Unexpected Error. Try Again.")
        }
    };
// DELETE NOTES

const deleteNote = async (data) => {
  const noteId = data._id
    try {
        const response = await axiosInstance.delete("/delete-note/" + noteId);
        
        if (response.data && !response.data.error){
            showToastMessage("Note Deleted Successfully",'delete')
            getAllNotes()
            
        }
    }
      catch (error) {
      if(error. response &&
        error. response.data &&
        error. response.data.message)
      {
        console.log("Unexpected Error. Try Again.")
      }
    }
}
 // Search for notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes",{
      params: { query },
    });

    if (response.data && response.data.notes) {
      setIsSearch (true);
      setAllNotes (response.data.notes);
    }
    } catch (error) {
    console. log (error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id
        try {
            const response = await axiosInstance.put("/update-note-pinned/" + noteId,
            {
              "isPinned": !noteData.isPinned,
            }
        );
            if (response.data && response.data.note){
                showToastMessage("Note Updated Successfully")
                getAllNotes()
            
            }
        }
            catch (error) {
           console.log(error)
        }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);
    

  const handleCloseModal = () => {
    setOpenAddEditModal({ isShown: false, type: 'add', data: null });
  };

  return (
    <>
      <Navbar userInfo={userInfo} 
      onSearchNote={onSearchNote} 
      handleClearSearch={handleClearSearch}
    />

      <div className="container mx-auto">
        {allNotes.length>0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item,index) => (
            <NoteCard
            key={item._id}
            title={item.title}
            date={item.createdon}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updateIsPinned(item)}
          />
          ))} 
        </div> 
        ) : (
          <EmptyCard imgSrc={isSearch ? NoDataImg : AddNotesImg} message={isSearch ? `Bruh! No Notes found matching your searches. You sure you didn't mistype? `:`Start creating your first note! Click the 'Add'
             button to jot down your thoughts, 
             ideas and reminders. Let's get started!`}/>
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })} // Updated to open modal
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleCloseModal} // Updated to handle modal close
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel="Add or Edit Notes" // Updated for accessibility
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll" // Add classes if needed
        >
        <AddEditNotes 
        type ={openAddEditModal.type}
        noteData = {openAddEditModal.data}
        onClose={()=>{
          
          setOpenAddEditModal({isShown:false,type:"add",data:null});
        }}
        getAllNotes = {getAllNotes}
        showToastMessage = {showToastMessage}
        />
        
        
        
      </Modal>

      <Toast
        isShown = {showToastMsg.isShown}
        message = {showToastMsg.message}
        type = {showToastMsg.type}
        onClose = {handleCloseToast}
      />
    </>
  );
};

export default Home;
