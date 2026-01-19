'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTodos, useCreateTodo, useCreateNaturalLanguageTodo, useUpdateTodo, useToggleTodoCompletion, useDeleteTodo } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, parseISO } from 'date-fns';
import { Priority } from '@prisma/client';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO 8601 string
  priority: Priority;
  tags?: string; // Comma-separated string
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function TodosPage() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>(undefined);
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>(Priority.MEDIUM);
  const [newTodoTags, setNewTodoTags] = useState('');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined);
  const [editPriority, setEditPriority] = useState<Priority>(Priority.MEDIUM);
  const [editTags, setEditTags] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<boolean | undefined>(undefined);
  const [filterTag, setFilterTag] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | undefined>(undefined);

  const { data: todos, isLoading: isLoadingTodos, error: todosError } = useTodos({
    search: searchQuery,
    status: filterStatus,
    tag: filterTag,
    priority: filterPriority,
  });

  const createTodoMutation = useCreateTodo();
  const createNaturalLanguageTodoMutation = useCreateNaturalLanguageTodo();
  const updateTodoMutation = useUpdateTodo();
  const toggleCompletionMutation = useToggleTodoCompletion();
  const deleteTodoMutation = useDeleteTodo();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || isLoadingTodos) {
    return <div className="flex items-center justify-center min-h-screen">Loading Todos...</div>;
  }

  if (!isAuthenticated || !user || todosError) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error loading todos or unauthorized.</div>;
  }

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle) return;
    await createTodoMutation.mutateAsync({
      title: newTodoTitle,
      description: newTodoDescription,
      dueDate: newTodoDueDate ? formatISO(newTodoDueDate) : undefined,
      priority: newTodoPriority,
      tags: newTodoTags,
    });
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoDueDate(undefined);
    setNewTodoPriority(Priority.MEDIUM);
    setNewTodoTags('');
  };

  const handleCreateNaturalLanguageTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalLanguageInput) return;
    await createNaturalLanguageTodoMutation.mutateAsync({ text: naturalLanguageInput });
    setNaturalLanguageInput('');
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate ? parseISO(todo.dueDate) : undefined);
    setEditPriority(todo.priority);
    setEditTags(todo.tags || '');
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    await updateTodoMutation.mutateAsync({
      id: editingTodo.id,
      updates: {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate ? formatISO(editDueDate) : undefined,
        priority: editPriority,
        tags: editTags,
      },
    });
    setEditingTodo(null);
  };

  const handleToggleCompletion = async (id: string) => {
    await toggleCompletionMutation.mutateAsync(id);
  };

  const handleDeleteTodo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodoMutation.mutateAsync(id);
    }
  };

  const filteredTodos = todos?.filter(todo => {
    // Basic client-side filtering example, backend handles most of it
    if (filterStatus !== undefined && todo.completed !== filterStatus) return false;
    if (filterTag && !todo.tags?.includes(filterTag)) return false;
    if (filterPriority && todo.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name || user.email}</h1>
        <Button onClick={logout}>Logout</Button>
      </header>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Todo</h2>
        <form onSubmit={handleCreateTodo} className="space-y-4 mb-4 p-4 border rounded-lg shadow-sm">
          <div>
            <Label htmlFor="newTodoTitle">Title</Label>
            <Input
              id="newTodoTitle"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Buy groceries"
              required
            />
          </div>
          <div>
            <Label htmlFor="newTodoDescription">Description (Optional)</Label>
            <Textarea
              id="newTodoDescription"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Milk, eggs, bread..."
            />
          </div>
          <div>
            <Label htmlFor="newTodoDueDate">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[240px] justify-start text-left font-normal ${!newTodoDueDate && "text-muted-foreground"}`}
                >
                  {newTodoDueDate ? format(newTodoDueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTodoDueDate}
                  onSelect={setNewTodoDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="newTodoPriority">Priority</Label>
            <Select onValueChange={(value: Priority) => setNewTodoPriority(value)} defaultValue={newTodoPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Priority).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="newTodoTags">Tags (comma-separated, e.g., work,home)</Label>
            <Input
              id="newTodoTags"
              value={newTodoTags}
              onChange={(e) => setNewTodoTags(e.target.value)}
              placeholder="work, personal"
            />
          </div>
          <Button type="submit" disabled={createTodoMutation.isPending}>
            {createTodoMutation.isPending ? 'Creating...' : 'Add Todo'}
          </Button>
        </form>

        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Natural Language Todo Creation</h3>
          <form onSubmit={handleCreateNaturalLanguageTodo} className="space-y-4">
            <div>
              <Label htmlFor="naturalLanguageInput">Enter your todo (e.g., Buy milk tomorrow at 5pm p:high #groceries)</Label>
              <Textarea
                id="naturalLanguageInput"
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                placeholder="Finish report by next Friday high priority #work"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={createNaturalLanguageTodoMutation.isPending}>
              {createNaturalLanguageTodoMutation.isPending ? 'Parsing & Creating...' : 'Create from Text'}
            </Button>
          </form>
        </div>
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Filters and Search</h2>
        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Select onValueChange={(value: string) => setFilterStatus(value === 'true' ? true : value === 'false' ? false : undefined)} value={filterStatus === true ? 'true' : filterStatus === false ? 'false' : 'all'}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Completed</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by tag (e.g., work)"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="w-[180px]"
          />
          <Select onValueChange={(value: Priority) => setFilterPriority(value)} value={filterPriority || 'all'}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.values(Priority).map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTodos?.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No todos found.</p>
        ) : (
          filteredTodos?.map((todo) => (
            <Card key={todo.id} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      ...
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(todo)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteTodo(todo.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-2">
                {todo.description && <p className="text-sm text-gray-700 dark:text-gray-300">{todo.description}</p>}
                <div className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleCompletion(todo.id)}
                    id={`todo-${todo.id}`}
                  />
                  <label htmlFor={`todo-${todo.id}`} className="cursor-pointer select-none">
                    {todo.completed ? 'Completed' : 'Mark Complete'}
                  </label>
                </div>
                {todo.dueDate && (
                  <p className={`text-sm ${isValid(parseISO(todo.dueDate)) && parseISO(todo.dueDate) < new Date() && !todo.completed ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    Due: {isValid(parseISO(todo.dueDate)) ? format(parseISO(todo.dueDate), 'PPP') : 'Invalid Date'}
                    {isValid(parseISO(todo.dueDate)) && parseISO(todo.dueDate) < new Date() && !todo.completed && <Badge variant="destructive" className="ml-2">Overdue</Badge>}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Priority: {todo.priority}</Badge>
                  {todo.tags?.split(',').filter(Boolean).map((tag, index) => (
                    <Badge key={index} variant="outline">{tag.trim()}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>Make changes to your todo here.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTodo} className="space-y-4">
            <div>
              <Label htmlFor="editTitle">Title</Label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description (Optional)</Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editDueDate">Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-[240px] justify-start text-left font-normal ${!editDueDate && "text-muted-foreground"}`}
                  >
                    {editDueDate ? format(editDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editDueDate}
                    onSelect={setEditDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="editPriority">Priority</Label>
              <Select onValueChange={(value: Priority) => setEditPriority(value)} defaultValue={editPriority}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editTags">Tags (comma-separated, e.g., work,home)</Label>
              <Input
                id="editTags"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateTodoMutation.isPending}>
                {updateTodoMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Temporary useQueryClient due to next.js 14.x issue, remove if fixed
import { useQueryClient } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
