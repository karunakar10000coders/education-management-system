import * as initialData from '../data/mockData';

// Helper to delay simulation
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Load data from LocalStorage or initialize with mockData
export const getStorageData = (key, fallbackData) => {
  try {
    const data = localStorage.getItem(`edupulse_${key}`);
    if (data) return JSON.parse(data);
    localStorage.setItem(`edupulse_${key}`, JSON.stringify(fallbackData));
    return fallbackData;
  } catch (error) {
    console.error(`Error reading ${key} from LocalStorage`, error);
    return fallbackData;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(`edupulse_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to LocalStorage`, error);
  }
};

// Generic CRUD API Handler
export const createCrudService = (storageKey, initialSeed) => {
  return {
    async getAll() {
      await delay(200);
      return getStorageData(storageKey, initialSeed);
    },

    async getById(id) {
      await delay(150);
      const list = getStorageData(storageKey, initialSeed);
      return list.find((item) => item.id === id) || null;
    },

    async create(newItem) {
      await delay(300);
      const list = getStorageData(storageKey, initialSeed);
      const itemWithId = {
        ...newItem,
        id: `${storageKey.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      const updatedList = [itemWithId, ...list];
      setStorageData(storageKey, updatedList);
      return itemWithId;
    },

    async update(id, updatedFields) {
      await delay(300);
      const list = getStorageData(storageKey, initialSeed);
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) throw new Error('Item not found');
      
      const updatedItem = { ...list[index], ...updatedFields, updatedAt: new Date().toISOString() };
      list[index] = updatedItem;
      setStorageData(storageKey, list);
      return updatedItem;
    },

    async delete(id) {
      await delay(250);
      const list = getStorageData(storageKey, initialSeed);
      const filtered = list.filter((item) => item.id !== id);
      setStorageData(storageKey, filtered);
      return { success: true, id };
    },
  };
};

export const studentService = createCrudService('students', initialData.mockStudents);
export const teacherService = createCrudService('teachers', initialData.mockTeachers);
export const parentService = createCrudService('parents', initialData.mockParents);
export const classService = createCrudService('classes', initialData.mockClasses);
export const subjectService = createCrudService('subjects', initialData.mockSubjects);
export const attendanceService = createCrudService('attendance', initialData.mockAttendance);
export const timetableService = createCrudService('timetable', initialData.mockTimetable);
export const assignmentService = createCrudService('assignments', initialData.mockAssignments);
export const examService = createCrudService('exams', initialData.mockExams);
export const resultService = createCrudService('results', initialData.mockResults);
export const feeService = createCrudService('fees', initialData.mockFees);
export const bookService = createCrudService('books', initialData.mockBooks);
export const noticeService = createCrudService('notices', initialData.mockNotices);
export const eventService = createCrudService('events', initialData.mockEvents);
export const messageService = createCrudService('messages', initialData.mockMessages);
export const userService = createCrudService('users', initialData.mockUsers);

export const settingsService = {
  async getSettings() {
    await delay(150);
    return getStorageData('settings', initialData.mockSettings);
  },
  async updateSettings(newSettings) {
    await delay(300);
    const current = getStorageData('settings', initialData.mockSettings);
    const updated = { ...current, ...newSettings };
    setStorageData('settings', updated);
    return updated;
  }
};
