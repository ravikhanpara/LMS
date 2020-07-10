import { LightningElement, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { subscribe, APPLICATION_SCOPE, MessageContext} from "lightning/messageService";
import MessageBus from "@salesforce/messageChannel/MessageService__c";
import getRecordDetail from "@salesforce/apex/getObjectDetail.getRecordDetail";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";

export default class listener extends NavigationMixin(LightningElement) {
  @wire(MessageContext) messageContext;
  @wire(CurrentPageReference) pageRef;

  receivedMessage;
  objectName = "";
  objectLabel;
  record = {};
  showDetail = false;
  recordId;
  MessageChannelId;
  connectedCallback() {
    subscribe(
      this.messageContext,
      MessageBus,
      message => {
        this.handleMessage(message);
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  handleMessage(message) {
    if (message) {
      this.recordId = message.recordId;
      if (message.recordId && this.objectName === "") {
        getRecordDetail({
          recordId: this.recordId
        })
          .then(result => {
            this.objectName = result.objectName;
            this.objectLabel = result.objectLabel;
            this.record = result.records;
          })
          .catch(error => {
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error",
                variant: "error",
                message: error.body.message,
                mode: "dismissable "
              })
            );
          });
      }
      this.showDetail = true;
      this.MessageChannelId = message ? message.MessageChannelId : "";
      this.receivedMessage = message ? message.message : "no message payload";
    }
  }
  toggleBlock(event) {
    this.template
      .querySelector("." + event.target.dataset.blockid)
      .classList.toggle("rotate-block-icon");
    this.template.querySelector(
      ".Field" + event.target.dataset.blockid
    ).style.display =
      this.template.querySelector(".Field" + event.target.dataset.blockid).style
        .display === "none"
        ? "block"
        : "none";
  }
  viewRecordDetail() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.recordId,
        actionName: "view"
      }
    });
  }
  viewObjectDetail() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: this.objectName,
        actionName: "list"
      }
    });
  }
  get showAdditionalDetail() {
    return this.objectName === "Account";
  }
}