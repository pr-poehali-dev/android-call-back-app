import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: number;
  name: string;
  phone: string;
  attempts: number;
  status: 'pending' | 'calling' | 'completed' | 'failed';
  lastCall?: string;
}

const Index = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Александр Петров', phone: '+7 (999) 123-45-67', attempts: 0, status: 'pending' },
    { id: 2, name: 'Мария Иванова', phone: '+7 (999) 987-65-43', attempts: 0, status: 'pending' },
  ]);
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [delayMinutes, setDelayMinutes] = useState([5]);
  const [maxAttempts, setMaxAttempts] = useState([3]);
  const [isActive, setIsActive] = useState(false);

  const addContact = () => {
    if (!newName || !newPhone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const newContact: Contact = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
      attempts: 0,
      status: 'pending',
    };

    setContacts([...contacts, newContact]);
    setNewName('');
    setNewPhone('');
    
    toast({
      title: 'Контакт добавлен',
      description: `${newName} добавлен в список`,
    });
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const startCalling = () => {
    setIsActive(true);
    toast({
      title: 'Перезвон активирован',
      description: `Запущен автоматический перезвон по ${contacts.length} контактам`,
    });
    
    const interval = setInterval(() => {
      setContacts(prev => prev.map(contact => {
        if (contact.status === 'pending' && contact.attempts < maxAttempts[0]) {
          return {
            ...contact,
            attempts: contact.attempts + 1,
            status: 'calling' as const,
            lastCall: new Date().toLocaleTimeString('ru-RU'),
          };
        }
        if (contact.status === 'calling') {
          const completed = Math.random() > 0.5;
          return {
            ...contact,
            status: completed ? 'completed' as const : 'pending' as const,
          };
        }
        if (contact.attempts >= maxAttempts[0] && contact.status !== 'completed') {
          return { ...contact, status: 'failed' as const };
        }
        return contact;
      }));
    }, delayMinutes[0] * 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsActive(false);
    }, delayMinutes[0] * maxAttempts[0] * contacts.length * 1000);
  };

  const stopCalling = () => {
    setIsActive(false);
    toast({
      title: 'Перезвон остановлен',
      description: 'Автоматический перезвон приостановлен',
    });
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'calling': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'calling': return 'Звоню';
      case 'failed': return 'Не удалось';
      default: return 'Ожидание';
    }
  };

  const stats = {
    total: contacts.length,
    completed: contacts.filter(c => c.status === 'completed').length,
    pending: contacts.filter(c => c.status === 'pending').length,
    failed: contacts.filter(c => c.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4 shadow-lg">
            <Icon name="Phone" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Автоперезвон</h1>
          <p className="text-gray-600">Умная система автоматических перезвонов</p>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Icon name="Home" size={16} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <Icon name="HelpCircle" size={16} />
              Помощь
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Всего контактов</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Завершено</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">В очереди</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={24} className="text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Phone" size={20} />
                Список перезвонов
              </h2>
              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Icon name="UserPlus" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Добавьте контакты для начала работы</p>
                  </div>
                ) : (
                  contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(contact.status)} animate-pulse`} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          {contact.lastCall && (
                            <p className="text-xs text-gray-500 mt-1">Последний звонок: {contact.lastCall}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {contact.attempts}/{maxAttempts[0]} попыток
                        </Badge>
                        <Badge className={getStatusColor(contact.status) + ' text-white'}>
                          {getStatusText(contact.status)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContact(contact.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={startCalling}
                  disabled={contacts.length === 0}
                >
                  <Icon name="Play" size={24} className="mr-2" />
                  Запустить перезвон
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  className="px-8 py-6 text-lg shadow-lg"
                  onClick={stopCalling}
                >
                  <Icon name="Square" size={24} className="mr-2" />
                  Остановить
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="Sliders" size={20} />
                Параметры перезвона
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Задержка между попытками: {delayMinutes[0]} мин</Label>
                  <Slider
                    value={delayMinutes}
                    onValueChange={setDelayMinutes}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">Интервал времени между автоматическими звонками</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Количество попыток: {maxAttempts[0]}</Label>
                  <Slider
                    value={maxAttempts}
                    onValueChange={setMaxAttempts}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">Сколько раз система попытается дозвониться до каждого контакта</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="UserPlus" size={20} />
                Добавить контакт
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    placeholder="Введите имя"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (___) ___-__-__"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={addContact} className="w-full mt-4" size="lg">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить контакт
              </Button>
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="List" size={20} />
                Управление контактами ({contacts.length})
              </h2>
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(contact.id)}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Icon name="X" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="BookOpen" size={20} />
                Как пользоваться приложением
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Добавьте контакты</h3>
                    <p className="text-gray-600">Перейдите в раздел "Контакты" и добавьте номера телефонов для автоматического перезвона</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Настройте параметры</h3>
                    <p className="text-gray-600">В разделе "Настройки" установите интервал между звонками и максимальное количество попыток</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Запустите перезвон</h3>
                    <p className="text-gray-600">На главной странице нажмите кнопку "Запустить перезвон" и система автоматически начнет обзванивать контакты</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Следите за статистикой</h3>
                    <p className="text-gray-600">Отслеживайте прогресс в реальном времени: количество завершенных, ожидающих и неудачных звонков</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <Icon name="Info" size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Важная информация</h3>
                  <p className="text-blue-800 text-sm">
                    Это демонстрационное приложение. В реальной версии потребуется интеграция с телефонией для совершения звонков.
                    Текущая версия показывает работу интерфейса и логики приложения.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
