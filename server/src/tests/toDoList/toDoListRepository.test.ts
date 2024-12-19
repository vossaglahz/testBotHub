import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ToDoListRepository } from '@/repositories/toDoList.repository';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';

const mockUserRepository = {
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
};

const mockLawyerRepository = {
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
};

const mockToDoListRepository = {
    createToDoList: jest.fn(),
    deleteToDoList: jest.fn(),
    changeToDoList: jest.fn(),
    findOne: jest.fn(),
};

describe('ToDoListRepository', () => {
    let toDoListRepository: ToDoListRepository;
    let user: User;
    let lawyer: Lawyer;
    const refreshToken = 'mock-refresh-token';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ToDoListRepository,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(Lawyer),
                    useValue: mockLawyerRepository,
                },
                {
                    provide: ToDoListRepository,
                    useValue: mockToDoListRepository,
                },
            ],
        }).compile();

        toDoListRepository = module.get<ToDoListRepository>(ToDoListRepository);
    });

    beforeEach(async () => {
        user = { id: 1, name: 'Test User', surname: 'Testov', email: 'testuser@test.com', password: 'password' } as User;
        lawyer = { id: 1, name: 'Test Lawyer', surname: 'Testov', email: 'testlawyer@test.com', password: 'password' } as Lawyer;

        mockUserRepository.save.mockResolvedValue(user);
        mockLawyerRepository.save.mockResolvedValue(lawyer);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('должен создавать новую задачу', async () => {
        const newToDoDto = {
            text: 'New Task',
            status: 'Doing',
            user,
            lawyer,
        };

        const mockCreatedToDo = { ...newToDoDto, id: 1 };
        mockToDoListRepository.createToDoList.mockResolvedValue(mockCreatedToDo);

        const createdToDo = await toDoListRepository.createToDoList(newToDoDto, refreshToken);

        expect(createdToDo).toHaveProperty('id');
        expect(createdToDo.text).toBe(newToDoDto.text);
        expect(createdToDo.status).toBe(newToDoDto.status);
        expect(createdToDo.user.id).toBe(user.id);
        expect(createdToDo.lawyer.id).toBe(lawyer.id);
    });

    it('должен удалить существующую задачу', async () => {
        const newToDoDto = {
            text: 'Task to delete',
            status: 'Doing',
            user,
            lawyer,
        };

        const mockCreatedToDo = { ...newToDoDto, id: 1 };
        mockToDoListRepository.createToDoList.mockResolvedValue(mockCreatedToDo);
        mockToDoListRepository.deleteToDoList.mockResolvedValue({ message: 'ToDo deleted successfully' });

        const newToDo = await toDoListRepository.createToDoList(newToDoDto, refreshToken);

        const todoIdString = newToDo.id.toString();

        await toDoListRepository.deleteToDoList(refreshToken, todoIdString);

        expect(mockToDoListRepository.deleteToDoList).toHaveBeenCalledWith(refreshToken, todoIdString);
    });

    it('должен поменять статус существующей задачи', async () => {
        const newToDoDto = {
            text: 'Task to change status',
            status: 'Process',
            user,
            lawyer,
        };

        const mockCreatedToDo = { ...newToDoDto, id: 1 };
        mockToDoListRepository.createToDoList.mockResolvedValue(mockCreatedToDo);

        const updatedToDo = { ...mockCreatedToDo, status: 'Completed' };
        mockToDoListRepository.changeToDoList.mockResolvedValue(updatedToDo);

        const newToDo = await toDoListRepository.createToDoList(newToDoDto, refreshToken);

        const todoIdString = newToDo.id.toString();

        const updated = await toDoListRepository.changeToDoList(refreshToken, todoIdString, 'Completed');

        expect(updated.status).toBe('Completed');
    });
});
