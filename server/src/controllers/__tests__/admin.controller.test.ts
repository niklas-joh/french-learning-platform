import { Request, Response } from 'express';
import path from 'path'; // Import path module
import { adminTestController, getAnalyticsSummary } from '../admin.controller';
import knexImport from '../../config/db'; // Adjusted path for knex
import fs from 'fs'; // Use fs, which will be the mocked version

// Force cast knexImport to jest.Mock, as jest.mock should ensure it is one.
const knex = knexImport as unknown as jest.Mock;

// Mock knex
const mockKnexInstance = {
  count: jest.fn().mockReturnThis(),
  first: jest.fn(),
  select: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  // from: jest.fn().mockReturnThis(), // if knex.from is used directly
};

jest.mock('../../config/db', () => {
  return jest.fn(() => mockKnexInstance);
});

// Mock fs
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
  },
}));

// Mock console.error
jest.spyOn(console, 'error').mockImplementation(() => {});


describe('Admin Controllers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reset mocks before each test
    knex.mockClear(); // Clears the main mock factory
    // Clear mocks on the instance methods
    mockKnexInstance.first.mockReset();
    mockKnexInstance.groupBy.mockReset();
    mockKnexInstance.count.mockClear();
    mockKnexInstance.select.mockClear();

    (fs.promises.readdir as jest.Mock).mockReset();
    (fs.promises.stat as jest.Mock).mockReset();
    (console.error as jest.Mock).mockClear();
  });

  describe('adminTestController', () => {
    test('should return 200 with a success message', () => {
      adminTestController(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Admin route test successful!' });
    });
  });

  describe('getAnalyticsSummary', () => {
    const mockTotalUsersResult = { count: '15' };
    const mockUsersByRoleResult = [
      { role: 'admin', count: '2' },
      { role: 'user', count: '13' },
    ];
    const mockTopicFolders = ['topicA', 'topicB'];
    const mockTopicAFiles = ['a1.json', 'a2.json'];
    const mockTopicBFiles = ['b1.json'];

    test('should return 200 with analytics summary on success', async () => {
      mockKnexInstance.first.mockResolvedValueOnce(mockTotalUsersResult);
      mockKnexInstance.groupBy.mockResolvedValueOnce(mockUsersByRoleResult);

      const controllerFileDirname = path.resolve(__dirname, '..');
      const projectRootPath = path.resolve(controllerFileDirname, '../../..');
      const absExpectedTopicsDir = path.join(projectRootPath, 'content/topics');
      const absExpectedTopicAPath = path.join(absExpectedTopicsDir, 'topicA');
      const absExpectedTopicBPath = path.join(absExpectedTopicsDir, 'topicB');

      let readdirCallCount = 0;
      (fs.promises.readdir as jest.Mock).mockImplementation(async (p: string) => {
        readdirCallCount++;
        const normalizedP = path.normalize(p);

        if (readdirCallCount === 1) {
          if (normalizedP === path.normalize(absExpectedTopicsDir)) {
            return mockTopicFolders;
          }
          throw new Error(`fs.readdir (Call #1) expected topicsDir, got ${normalizedP} vs ${path.normalize(absExpectedTopicsDir)}`);
        } else if (readdirCallCount === 2) {
          if (normalizedP === path.normalize(absExpectedTopicAPath)) {
            return mockTopicAFiles;
          }
          throw new Error(`fs.readdir (Call #2) expected topicA, got ${normalizedP} vs ${path.normalize(absExpectedTopicAPath)}`);
        } else if (readdirCallCount === 3) {
          if (normalizedP === path.normalize(absExpectedTopicBPath)) {
            return mockTopicBFiles;
          }
          throw new Error(`fs.readdir (Call #3) expected topicB, got ${normalizedP} vs ${path.normalize(absExpectedTopicBPath)}`);
        }
        throw new Error(`fs.readdir mock called too many times (Call #${readdirCallCount}) or with unexpected path: ${normalizedP}`);
      });

      (fs.promises.stat as jest.Mock).mockImplementation(async (p: string) => {
        const normalizedP = path.normalize(p);
        if (normalizedP === path.normalize(absExpectedTopicAPath) || normalizedP === path.normalize(absExpectedTopicBPath)) {
          return { isDirectory: () => true };
        }
        throw new Error (`fs.stat mock called with unexpected path ${normalizedP} (expected ${path.normalize(absExpectedTopicAPath)} or ${path.normalize(absExpectedTopicBPath)})`);
      });

      await getAnalyticsSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        totalUsers: 15,
        usersByRole: [
          { role: 'admin', count: 2 },
          { role: 'user', count: 13 },
        ],
        totalContentItems: 3, // a1.json, a2.json, b1.json
      });
    });

    test('should return 500 if database query for total users fails', async () => {
      mockKnexInstance.first.mockRejectedValueOnce(new Error('DB error'));

      await getAnalyticsSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to fetch analytics summary' });
      expect(console.error).toHaveBeenCalledWith('Error fetching analytics summary:', expect.any(Error));
    });
    
    test('should return 500 if database query for users by role fails', async () => {
      mockKnexInstance.first.mockResolvedValueOnce(mockTotalUsersResult); // Total users succeeds
      mockKnexInstance.groupBy.mockRejectedValueOnce(new Error('DB error for roles')); // Roles fails

      await getAnalyticsSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to fetch analytics summary' });
      expect(console.error).toHaveBeenCalledWith('Error fetching analytics summary:', expect.any(Error));
    });

    test('should return 200 with totalContentItems as 0 if fs.readdir for topicsDir fails', async () => {
      mockKnexInstance.first.mockResolvedValueOnce(mockTotalUsersResult);
      mockKnexInstance.groupBy.mockResolvedValueOnce(mockUsersByRoleResult);
      
      (fs.promises.readdir as jest.Mock).mockImplementationOnce(async (p: string) => {
        const controllerFileDirname = path.resolve(__dirname, '..');
        const projectRootPath = path.resolve(controllerFileDirname, '../../..');
        const absExpectedTopicsDirForThisTest = path.join(projectRootPath, 'content/topics');
  
        const normalizedP = path.normalize(p);
        if (normalizedP === path.normalize(absExpectedTopicsDirForThisTest)) {
          throw new Error('FS error reading topicsDir (mocked)');
        }
        throw new Error(`fs.readdir mock (topicsDir FAIL test) called with unexpected path ${normalizedP}`);
      });

      await getAnalyticsSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        totalUsers: 15,
        usersByRole: [
          { role: 'admin', count: 2 },
          { role: 'user', count: 13 },
        ],
        totalContentItems: 0,
      }));
      expect(console.error).toHaveBeenCalledWith("Error reading content directory for analytics:", expect.any(Error));
    });

    test('should correctly sum content items even if one topic subfolder read fails', async () => {
      mockKnexInstance.first.mockResolvedValueOnce(mockTotalUsersResult);
      mockKnexInstance.groupBy.mockResolvedValueOnce(mockUsersByRoleResult);

      const controllerFileDirname = path.resolve(__dirname, '..');
      const projectRootPath = path.resolve(controllerFileDirname, '../../..');
      const absExpectedTopicsDirForSubFail = path.join(projectRootPath, 'content/topics');
      const absExpectedTopicAPathForSubFail = path.join(absExpectedTopicsDirForSubFail, 'topicA');
      const absExpectedTopicBPathForSubFail = path.join(absExpectedTopicsDirForSubFail, 'topicB');

      (fs.promises.readdir as jest.Mock)
        .mockImplementationOnce(async (p: string) => { // For topicsDir
          if (path.normalize(p) === path.normalize(absExpectedTopicsDirForSubFail)) {
            return mockTopicFolders; // ['topicA', 'topicB']
          }
          throw new Error('fs.readdir mock (subfolder FAIL test, 1st call) did not match topicsDir');
        })
        .mockImplementationOnce(async (p: string) => { // For topicA
          if (path.normalize(p) === path.normalize(absExpectedTopicAPathForSubFail)) {
            return mockTopicAFiles; // ['a1.json', 'a2.json']
          }
          throw new Error('fs.readdir mock (subfolder FAIL test, 2nd call) did not match topicA');
        })
        .mockImplementationOnce(async (p: string) => { // For topicB - intended to fail
          if (path.normalize(p) === path.normalize(absExpectedTopicBPathForSubFail)) {
            throw new Error('FS error reading topicB (mocked)');
          }
          throw new Error('fs.readdir mock (subfolder FAIL test, 3rd call) did not match topicB');
        });
      
      (fs.promises.stat as jest.Mock).mockImplementation(async (p: string) => {
          if (path.normalize(p) === path.normalize(absExpectedTopicAPathForSubFail) || path.normalize(p) === path.normalize(absExpectedTopicBPathForSubFail)) {
              return { isDirectory: () => true };
          }
          throw new Error(`fs.stat mock (subfolder FAIL test) called with unexpected path ${path.normalize(p)}`);
      });

      await getAnalyticsSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      // Given Promise.all rejects if any sub-promise rejects, totalContentItems should remain 0.
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        totalContentItems: 0, 
      }));
      expect(console.error).toHaveBeenCalledWith("Error reading content directory for analytics:", expect.any(Error));
    });
  });
});
