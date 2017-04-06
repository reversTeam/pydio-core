const React = require('react');
import ShareContextConsumer from '../ShareContextConsumer'
import RemoteUsers from './RemoteUsers'
import SharedUsers from './SharedUsers'
const {Divider} = require('material-ui')

let UsersPanel = React.createClass({

    propTypes:{
        shareModel:React.PropTypes.instanceOf(ReactModel.Share),
        showMailer:React.PropTypes.func
    },

    onUserUpdate: function(operation, userId, userData){
        this.props.shareModel.updateSharedUser(operation, userId, userData);
    },

    onSaveSelection:function(){
        const label = window.prompt(this.props.getMessage(510, ''));
        if(!label) return;
        this.props.shareModel.saveSelectionAsTeam(label);
    },

    sendInvitations:function(userObjects){
        try{
            const mailData = this.props.shareModel.prepareEmail("repository");
            this.props.showMailer(mailData.subject, mailData.message, userObjects);
        }catch(e){
            global.alert(e.message);
        }
    },

    render: function(){
        const currentUsers = this.props.shareModel.getSharedUsers();
        const federatedEnabled = ReactModel.Share.federatedSharingEnabled();
        let remoteUsersBlock;
        if(federatedEnabled){
            remoteUsersBlock = (
                <div style={{padding: '0 16px'}}>
                    <RemoteUsers
                        shareModel={this.props.shareModel}
                        onUserUpdate={this.onUserUpdate}
                    />
                </div>
            );
        }
        return (
            <div style={this.props.style}>
                <div style={{padding: '0 16px 16px'}}>
                    <SharedUsers
                        showTitle={federatedEnabled}
                        users={currentUsers}
                        userObjects={this.props.shareModel.getSharedUsersAsObjects()}
                        sendInvitations={this.props.showMailer ? this.sendInvitations : null}
                        onUserUpdate={this.onUserUpdate}
                        saveSelectionAsTeam={PydioUsers.Client.saveSelectionSupported()?this.onSaveSelection:null}
                        pydio={this.props.pydio}
                    />
                </div>
                {remoteUsersBlock && <Divider/>}
                {remoteUsersBlock}
            </div>
        );
    }
});

UsersPanel = ShareContextConsumer(UsersPanel);
export {UsersPanel as default}