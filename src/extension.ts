
import * as vscode from 'vscode';

class FaLorem {

	private keyword: string = "falorem";
	private expandCommandName: string = "falorem.expand";
	private keywordPattern: RegExp = new RegExp(`(${this.keyword})([0-9]*)`, "mi");

	private loremQuantity: number = 1;
	private defaultQuantity: number = 10;
	// sampleText:string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum facere facilis non.";
	// sampleText:string = `مداد رنگی ها مشغول بودند به جز مداد سفید، هیچکس به او کار نمیداد، همه میگفتند : تو به هیچ دردی نمیخوری، یک شب که مداد رنگی ها تو سیاهی شب گم شده بودند، مداد سفید تا صبح ماه کشید مهتاب کشید و انقدر ستاره کشید که کوچک و کوچکتر شد صبح توی جعبه مداد رنگی جای خالی او با هیچ رنگی  پر نشد، به یاد هم باشیم شاید فردا ما هم در کنار هم نباشیم…`;
	private sampleText: string = `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.`;

	private currentLine: number = 0;
	private lineContent: string = "";
	private output: string = "";
	private editor!: vscode.TextEditor;
	private parsedCommand!: string[];

	constructor() {

		this.setEditor();
		vscode.window.onDidChangeActiveTextEditor(this.setEditor);

	}


	activate = (context: vscode.ExtensionContext) => {

		console.log('Congratulations, your extension "falorem" is now active!');

		// Watch for every change in the document
		vscode.commands.registerTextEditorCommand(this.expandCommandName, this.expandKeyword);

		let activateMsg = vscode.commands.registerCommand('falorem.start', () => {
			vscode.window.showInformationMessage('Hello World from FaLorem!');
		});


		context.subscriptions.push(activateMsg);
	}

	expandKeyword = () => {


		if (!this.isKeyDetected())
			return;

		this.getQuantity();

		const {selection, startSelection} = this.getSelection();

		this.getOutput();

		// 3.1 Expand the keyword
		this.editor.edit(builder => {
			builder.delete(selection);
			builder.insert(startSelection, this.output);
		}).then(() => {
			console.warn("expanded");
		});

	}

	private isKeyDetected = () => {

		// if there is no editor opened
		if (!this.editor) {
			return;
		}

		// Determine current line & its content
		this.currentLine = this.editor.selection.active.line ?? 0;
		this.lineContent = this.editor.document.lineAt(this.currentLine).text;

		this.parsedCommand = this.keywordPattern.exec(this.lineContent) || [];

		this.parsedCommand && console.warn("falorem key detected!");

		return this.parsedCommand;

	}


	getQuantity = () => {
		this.loremQuantity = this.parsedCommand
							&& (Number(this.parsedCommand[2]) || this.defaultQuantity);
	}


	private getSelection = () => {


		const startChar = this.lineContent.indexOf(this.keyword);
		const endChar = startChar + this.keyword.length + this.parsedCommand[2].length;
		const startSelection = new vscode.Position(this.currentLine, startChar);
		const endSelection = new vscode.Position(this.currentLine, endChar);

		const selection = new vscode.Selection(startSelection, endSelection);

		console.log("falorem: selection finished");

		return { startChar, endChar, startSelection, endSelection, selection };

	}


	private getOutput = () => {

		// slice required amount of text
		this.output = this.sampleText.split(/\s+/ig)
			.slice(0, this.loremQuantity)
			.join(" ");

		console.log("falorem: output finished");

	}

	private setEditor = () => {
		if (vscode.window.activeTextEditor)
			this.editor = vscode.window.activeTextEditor;
		console.log("falorem: changed editor");

	}


	deactivate = () => { }

}


// TODO: Activation messga box not working.
// TODO: Document the code.
// TODO: Add customization ability.

const falorem = new FaLorem;

export function activate(context: vscode.ExtensionContext) {
	falorem.activate(context);
}

export function deactivate() {
	falorem.deactivate();
}