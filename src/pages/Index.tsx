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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,105,180,0.2),rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full mb-4 shadow-2xl animate-float">
            <Icon name="Phone" size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Автоперезвон
          </h1>
          <p className="text-gray-700 text-lg">Умная система автоматических перезвонов</p>
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
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100 mb-1">Всего контактов</p>
                    <p className="text-4xl font-bold text-white">{stats.total}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon name="Users" size={28} className="text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in border-0" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100 mb-1">Завершено</p>
                    <p className="text-4xl font-bold text-white">{stats.completed}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={28} className="text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in border-0" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100 mb-1">В очереди</p>
                    <p className="text-4xl font-bold text-white">{stats.pending}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={28} className="text-white" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-white/80 backdrop-blur-lg shadow-xl border border-purple-100 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Icon name="Phone" size={24} />
                Список перезвонов
              </h2>
              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="UserPlus" size={56} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg">Добавьте контакты для начала работы</p>
                  </div>
                ) : (
                  contacts.map((contact, index) => (
                    <div key={contact.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-purple-100 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(contact.status)} animate-pulse shadow-lg`} />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          {contact.lastCall && (
                            <p className="text-xs text-purple-600 mt-1 font-medium">📞 Последний звонок: {contact.lastCall}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-semibold border-purple-300 text-purple-700">
                          {contact.attempts}/{maxAttempts[0]} попыток
                        </Badge>
                        <Badge className={getStatusColor(contact.status) + ' text-white font-semibold shadow-md'}>
                          {getStatusText(contact.status)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContact(contact.id)}
                          className="hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <div className="flex justify-center gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
              {!isActive ? (
                <Button
                  size="lg"
                  className="px-12 py-8 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-pulse-glow"
                  onClick={startCalling}
                  disabled={contacts.length === 0}
                >
                  <Icon name="Play" size={28} className="mr-3" />
                  Запустить перезвон
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="px-12 py-8 text-xl font-bold bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                  onClick={stopCalling}
                >
                  <Icon name="Square" size={28} className="mr-3" />
                  Остановить
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-lg shadow-xl border border-purple-100 animate-scale-in">
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Icon name="Sliders" size={24} />
                Параметры перезвона
              </h2>
              
              <div className="space-y-8">
                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <Label className="text-lg font-bold text-purple-900">Задержка между попытками: {delayMinutes[0]} мин</Label>
                  <Slider
                    value={delayMinutes}
                    onValueChange={setDelayMinutes}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-purple-700">⏱️ Интервал времени между автоматическими звонками</p>
                </div>

                <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <Label className="text-lg font-bold text-blue-900">Количество попыток: {maxAttempts[0]}</Label>
                  <Slider
                    value={maxAttempts}
                    onValueChange={setMaxAttempts}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-blue-700">🔄 Сколько раз система попытается дозвониться до каждого контакта</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl border-2 border-purple-200 animate-scale-in">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Icon name="UserPlus" size={24} />
                Добавить контакт
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-semibold text-purple-900">Имя</Label>
                  <Input
                    id="name"
                    placeholder="Введите имя"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border-2 border-purple-300 focus:border-purple-500 text-base"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base font-semibold text-purple-900">Телефон</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (___) ___-__-__"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="border-2 border-purple-300 focus:border-purple-500 text-base"
                  />
                </div>
              </div>

              <Button onClick={addContact} className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" size="lg">
                <Icon name="Plus" size={22} className="mr-2" />
                Добавить контакт
              </Button>
            </Card>

            <Card className="p-8 bg-white/80 backdrop-blur-lg shadow-xl border border-purple-100 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Icon name="List" size={24} />
                Управление контактами ({contacts.length})
              </h2>
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-200 border border-purple-100 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                    <div>
                      <p className="font-bold text-purple-900">{contact.name}</p>
                      <p className="text-sm text-purple-600">{contact.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(contact.id)}
                      className="hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110"
                    >
                      <Icon name="X" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-lg shadow-xl border border-purple-100 animate-scale-in">
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Icon name="BookOpen" size={24} />
                Как пользоваться приложением
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-5 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-all animate-fade-in">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-purple-900">Добавьте контакты</h3>
                    <p className="text-gray-700">Перейдите в раздел "Контакты" и добавьте номера телефонов для автоматического перезвона</p>
                  </div>
                </div>

                <div className="flex gap-5 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-md transition-all animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-blue-900">Настройте параметры</h3>
                    <p className="text-gray-700">В разделе "Настройки" установите интервал между звонками и максимальное количество попыток</p>
                  </div>
                </div>

                <div className="flex gap-5 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 hover:shadow-md transition-all animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-pink-900">Запустите перезвон</h3>
                    <p className="text-gray-700">На главной странице нажмите кнопку "Запустить перезвон" и система автоматически начнет обзванивать контакты</p>
                  </div>
                </div>

                <div className="flex gap-5 p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 hover:shadow-md transition-all animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-green-900">Следите за статистикой</h3>
                    <p className="text-gray-700">Отслеживайте прогресс в реальном времени: количество завершенных, ожидающих и неудачных звонков</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 shadow-lg animate-slide-up">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Info" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-blue-900 mb-2">Важная информация</h3>
                  <p className="text-blue-900 text-base leading-relaxed">
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