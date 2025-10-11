import { inject, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { File } from '@awesome-cordova-plugins/file/ngx';

// UTILS
import { Constants, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    // INJECTIONS
    private readonly file: File = inject(File);
    private platform: Platform = inject(Platform);

    private generateNameLogFile(): string {
        const today: Date = new Date();
        return `${Constants.LOG_FILE_NAME}_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.${Constants.FORMAT_FILE_LOG}`;
    }

    private generateMessageLogError(err: any): string {
        let logError: string = '';
        if (err?.message) logError = ` -> ${err.message}`;
        if (err?.code) logError = ` -> ${err.code} - ${err.exception}`;
        return logError;
    }

    private generateMessageLog(type: ToastTypeEnum, page: PageEnum, msg: string, err: any = null): string {
        const errMsg: string = this.generateMessageLogError(err);
        const log: string = `${new Date().toString()}: ${type.toUpperCase()}(${page}) - ${msg} ${errMsg}`;
        if(type === ToastTypeEnum.SUCCESS || type === ToastTypeEnum.INFO)
            console.log(log);
        else if (type === ToastTypeEnum.WARNING)
            console.warn(log);
        else
            console.error(log, err);
        return log;
    }

    async logInfo(type: ToastTypeEnum, page: PageEnum, msg: string, err: any = null) {
        if(!environment.production || (type !== ToastTypeEnum.SUCCESS && type !== ToastTypeEnum.INFO)) {
            const logFileName: string = this.generateNameLogFile();
            const logFilePath: string = this.getRootPathFiles();
            const log: string = this.generateMessageLog(type, page, msg, err);

            if(this.platform.is('android')) {
                try {
                    await this.file.checkFile(logFilePath, logFileName).then(value => {
                        this.file.readAsText(logFilePath, logFileName).then(txt => {
                            this.file.writeExistingFile(logFilePath, logFileName, `${txt}\n${log}`).then(() => {
                            }).catch(err => console.error("Error saving loging " + err?.message));
                        }, err => {
                            console.error("Error reading loging " + err?.message);
                        });
                    }, reject => {
                        this.file.writeFile(logFilePath, logFileName, log).then(() => {
                        }).catch(err => console.error("Error creating loging " + err?.message));
                    });
                } catch(e: any) {
                    console.error('ERROR FileStorage ' + e);
                }
            } else {
                console.warn('Web mode - no log file created');
            }
        }
    }
    
    getDataDirectory(): string {
        return (!!this.file.externalDataDirectory ? this.file.externalDataDirectory : this.file.dataDirectory);
    }

    getRootDirectory(): string {
        return (!!this.file.externalDataDirectory ? this.file.externalDataDirectory : '');
    }

    getRootPathFiles(filePath: string = ''): string {
        return `${this.getDataDirectory()}${this.getRootRelativePath(filePath)}`;
    }

    getRootRelativePath(filePath: string = ''): string {
        return `${Constants.OUTPUT_DIR_NAME}/${filePath}`;
    }
}