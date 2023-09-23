import { TestBed } from '@angular/core/testing';

// LIBRARIES
import { File } from '@awesome-cordova-plugins/file/ngx';

// SERVICES
import { LogService } from './log.service';

// UTILS
import { ConstantsTest, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants } from '@utils/index';

describe('LogService', () => {
    let service: LogService;
    let file: File;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(LogService);
        file = TestBed.inject(File);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get data directory', () => {
        expect(service.getDataDirectory()).toEqual(ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY);
        file.externalRootDirectory = null;
        expect(service.getDataDirectory()).toEqual(ConstantsTest.PATH_DATA_DIRECTORY);
        file.externalRootDirectory = ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY;
    });

    it('should get root directory', () => {
        expect(service.getRootDirectory()).toEqual(ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY);
        file.externalRootDirectory = null;
        expect(service.getRootDirectory()).toEqual('');
        file.externalRootDirectory = ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY;
    });

    it('should get root path files', () => {
        expect(service.getRootPathFiles())
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY}${Constants.OUTPUT_DIR_NAME}/`);
        expect(service.getRootPathFiles('hola'))
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY}${Constants.OUTPUT_DIR_NAME}/hola`);
    });

    it('should get root relative path', () => {
        expect(service.getRootRelativePath())
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/`);
        expect(service.getRootRelativePath('hola'))
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/hola`);
    });

    
});
