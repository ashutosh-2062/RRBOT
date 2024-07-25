const {WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const {ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt } = require('botbuilder-dialogs');
const {DialogSet, DialogTurnStatus} = require('botbuilder-dialogs');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const DATETIME_PROMPT = 'DATE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
var endDialog ='';

class MakeReservationDialog extends ComponentDialog {

    constructor(_conservationState,_userState) {
            super('makeReservationDialog');
        

this.addDialog(new TextPrompt(TEXT_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.noOfParticipantsValidator));
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));

this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.firstStep.bind(this), //ask confirmation if user wants to make reservation?
            this.getName.bind(this), //get name for user
            this.getNumberOfParticipants.bind(this), //No of participants for rservation
            this.getDate.bind(this), //Date
            this.getTime.bind(this), //time
            this.confirmStep.bind(this), //show summary of values entered by user and ask confirmation
            this.summaryStep.bind(this)
]));


           
this.initialdialogId = WATERFALL_DIALOG;


    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
            
    }

    async firstStep(step) {
        endDialog = false;
        //Runnong a prompt here meas the next waterfallStep will be run when the users response is received.
        return await step.prompt(CONFIRM_PROMPT, 'Would you like to make a reservation?', ['yes','no']);
    }

    async getName(step){

        console.log(step.result);
        if(step.result === true){
            return await step.prompt(TEXT_PROMPT, 'In what name reservation is to be made?');
        }
    }

    async getNumberOfParticipants(step){

        step.values.name = step.result
        return await step.prompt(NUMBER_PROMPT, 'How many participants are there (1-150)?');
    }

    async getDate(step){

        step.values.noOfParticipants = step.result
        return await step.prompt(DATETIME_PROMPT, 'In what date reservation is to be made?')
    }

    async getTime(step){

        step.values.date = step.result
        return await step.prompt(DATETIME_PROMPT, 'At what Time?')
    }

    async confirmStep(step){

        step.values.time = step.result

        var msg = `You have entered following values: \n Name: ${step.values.name}\n Participants: ${step.values.noOfParticipants}\n Date: ${JSON.stringify(step.values.date)}\n Time: ${JSON.stringfy(step.values.time)}`
        await step.context.sendActivity(msg);

        return await step.prompt(CONFIRM_PROMPT, 'Are you sure that all values are correct and you want to make rservation?', ['yes','no']);
    }

    async summaryStep(step){

        if(step.result===true){
            //Business

            await step.context.sendActivity("Resrvation successfully made. Your reservation id is : 123456");
            endDialog = true;
            return await step.endDialog();
        }
    }

    async noOfParticipantsValidator(promptContext) {
        console.log(promptContext,recognized.value)

        return promptContext.recognized.succeeded && promptContext.recognized.value > 1 && promptContext.recognized.value < 150;
    }

    async isDialogComplete(){
        return endDialog;
    }

}

module.exports.MakeReservationDialog = MakeReservationDialog; 






