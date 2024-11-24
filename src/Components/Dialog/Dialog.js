import React, { useEffect } from 'react';
import './Dialog.css';
import moment from 'moment';
import GoogleLogo from '../icons/google_logo.png';
import Close from '../icons/close.png'

const Modal = ({ isOpen, onClose, eventDetails }) => {

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }


        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };

    }, [isOpen, onClose]);


    if (!isOpen) return null;
    var interviewWith = eventDetails?.['user_det']?.['candidate']?.['candidate_firstName'] || 'Lorem Ipsum';
    var position = eventDetails?.['job_id']?.['jobRequest_Title'] || 'Lorem Ipsum';
    var createBy = eventDetails?.['user_det']?.['job_id']?.['jobRequest_createdBy'] || 'Lorem Ipsum';
    var interviewDate = eventDetails['start'] ? moment(eventDetails['start']).format('Do MMM YYYY') : '-';
    var eventStartTime = moment(eventDetails['start']).format("hh:mm A");
    var eventEndTime = moment(eventDetails['end']).format("hh:mm A");
    var interviewTime = `${eventStartTime} to ${eventEndTime}`;
    var interviewVia = 'Google Meet';

    return (
        <div className="modal">
            <div className='close_icon_position' >
                <img onClick={onClose} src={Close} width={25} height={25} />
            </div>
            <div className="modal-content">
                <div className='dialog-container'>
                    <div className='event_dialog_left'>
                        <span className='panel-text'>Interview With: {interviewWith}</span>
                        <span className='panel-text'>Position: {position}</span>
                        <span className='panel-text'>Created By: {createBy}</span>
                        <span className='panel-text'>Interview Date: {interviewDate}</span>
                        <span className='panel-text'>Interview Time: {interviewTime}</span>
                        <span className='panel-text'>Interview Via: {interviewVia}</span>
                        <span className='download-btn'>
                            Resume.docx
                        </span>
                        <span className='download-btn'>
                            AadharCard
                        </span>
                    </div>
                    <div className='event_dialog_right'>
                        <div style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center' }}>
                            <img src={GoogleLogo} width={100} height={100} />
                            <div className='button_join'>
                                Join
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
