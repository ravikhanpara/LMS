import { LightningElement, wire, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { publish, MessageContext } from "lightning/messageService";
import MessageBus from "@salesforce/messageChannel/MessageService__c";

export default class broadcast extends LightningElement {
  @wire(MessageContext)
  messageContext;
  @api recordId;
  @track message;
  saveMessage(event) {
    this.message = event.target.value;
  }
  handleClick() {
    if (this.message) {
      const message = {
        recordId: this.recordId,
        message: this.message,
        MessageChannelId: MessageBus
      };
      publish(this.messageContext, MessageBus, message);
    } else {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          variant: "error",
          message: "Please Enter A Message.",
          mode: "dismissable "
        })
      );
    }
  }
}