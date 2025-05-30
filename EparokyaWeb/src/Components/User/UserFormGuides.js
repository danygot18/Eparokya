import React, { useState } from 'react';
import Modal from 'react-modal';
import GuestSideBar from '../GuestSideBar';
import wedding1 from '../../assets/images/Kasal-Paalala.png';
import wedding2 from '../../assets/images/Kasal2-Paalala.png';
import wedding3 from '../../assets/images/Kasal3-Paalala.png';
import baptism1 from '../../assets/images/Binyag1-Paalala.png';
import baptism2 from '../../assets/images/Binyag2-Paalala.png';
import funeral1 from '../../assets/images/Patay1-Paalala.png';
import funeral2 from '../../assets/images/Patay2-Paalala.png';
import './userFormGuide.css';

Modal.setAppElement('#root');

const UserFormGuides = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [zoom, setZoom] = useState(1);

    const openModal = (image) => {
        setCurrentImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setZoom(1);
    };

    const zoomIn = () => {
        setZoom(zoom + 0.1);
    };

    const zoomOut = () => {
        setZoom(zoom - 0.1);
    };

    return (
        <div className="user-form-guides">
            {/* <GuestSideBar /> */}
            <div className="image-gallery">
                <div className="row wedding">
                    <img src={wedding1} alt="Wedding 1" onClick={() => openModal(wedding1)} />
                    <img src={wedding2} alt="Wedding 2" onClick={() => openModal(wedding2)} />
                    <img src={wedding3} alt="Wedding 3" onClick={() => openModal(wedding3)} />
                </div>

                <div className="row baptism">
                    <img src={baptism1} alt="Baptism 1" onClick={() => openModal(baptism1)} />
                    <img src={baptism2} alt="Baptism 2" onClick={() => openModal(baptism2)} />
                </div>
                <div className="row funeral">
                    <img src={funeral1} alt="Funeral 1" onClick={() => openModal(funeral1)} />
                    <img src={funeral2} alt="Funeral 2" onClick={() => openModal(funeral2)} />
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <div className="modal-content">
                    <button onClick={closeModal} className="close-btn">Close</button>
                    <button onClick={zoomIn} className="zoom-btn">Zoom In</button>
                    <button onClick={zoomOut} className="zoom-btn">Zoom Out</button>
                    {currentImage && (
                        <img src={currentImage} alt="Modal" style={{ transform: `scale(${zoom})` }} />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default UserFormGuides;