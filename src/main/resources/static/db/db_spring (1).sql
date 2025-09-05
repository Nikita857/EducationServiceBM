-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Сен 05 2025 г., 08:35
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `db_spring`
--

-- --------------------------------------------------------

--
-- Структура таблицы `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` tinytext DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `courses`
--

INSERT INTO `courses` (`id`, `title`, `image`, `description`, `slug`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Управление проектами', 'polinom.png', 'Основы управления проектами', 'project-management', 'INACTIVE', '2025-08-25 14:32:16', '2025-08-25 14:32:44'),
(10, 'Java от а до z', '08ecca1e-1997-4c9b-9f91-1b242985b4cc.png', 'Java от а до zJava от а до zJava от а до zJava от а до z', 'java-ot-a-do-z', 'INACTIVE', '2025-08-25 16:33:48', '2025-08-25 16:33:48'),
(18, 'Инженер технолог БРиНТ', '12bdd8c5-4a45-483f-bd8e-16c057968d30.png', 'курс курс курс курс курс курс курс курс курс курс курс курс', 'inzhener-tehnolog-brint', 'ACTIVE', '2025-09-02 10:38:37', '2025-09-02 10:38:37');

-- --------------------------------------------------------

--
-- Структура таблицы `courses_seq`
--

CREATE TABLE `courses_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `courses_seq`
--

INSERT INTO `courses_seq` (`next_val`) VALUES
(1);

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `video` varchar(255) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `short_description` varchar(50) NOT NULL,
  `test_code` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`id`, `module_id`, `title`, `video`, `description`, `short_description`, `test_code`) VALUES
(19, 10, 'Урок 1.1 Создание техпроцесса. Подключение 3D модели и чертежа', '1.mp4', '- Программа ВЕРТИКАЛЬ — это САПР для разработки техпроцессов, интеграции с 3D-моделями и чертежами.\r\n\r\nШаг 1: Создание нового проекта** - В меню \"Файл\" → \"Новый\" → выбрать шаблон \"Технологический процесс\". - Указать параметры проекта: название, номер детали, материал. - Сохранение проекта в формате .vtp.\r\n\r\n*Шаг 2: Интеграция с моделью и чертежом** - В пункте меню \"3D модель детали\" → \"Импорт чертежа\"→ \"С диска\".\r\n- В пункте меню \"Чертеж\" → \"Импорт чертежа\". - Поддерживаемые форматы: .kdw (Компас), .dwg, .dxf. - Выбрать файл чертежа (например, \"Вал_001.kdw\") → \"Открыть\".\r\n\r\n*Шаг 3: Заполнение атрибутов ДСЕ** - В пункте меню выбираем \"3D модель детали\" → \"Импорт данных с документа\" - В дереве техпроцесса выбрать операцию → \"Привязать чертеж\". - Настроить отображение: выбрать листы чертежа, масштабировать. - Указать ссылки на размеры и допуски с чертежа для каждой операции.\r\n\r\n*Шаг 4: \"Добавление справочных данных\"** - Под вкладкой атрибуты кликаем по значку книги → \"Основной материал\" → \"Фильтр\" → \"Материалы и сортаменты\" - Ищем необходимый материал', '', '\r\n    const questions = [\r\n        {\r\n            question: \"Какой тип файла обычно используется для подключения 3D-модели в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"STEP (.stp)\", correct: true },\r\n                { text: \"PDF (.pdf)\", correct: false },\r\n                { text: \"TXT (.txt)\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Как называется модуль в Вертикаль 2018 для создания техпроцесса?\",\r\n            answers: [\r\n                { text: \"Технолог\", correct: true },\r\n                { text: \"Конструктор\", correct: false },\r\n                { text: \"Архиватор\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Что необходимо сделать для подключения чертежа в техпроцесс?\",\r\n            answers: [\r\n                { text: \"Импортировать файл в формате DWG/DXF\", correct: true },\r\n                { text: \"Создать новый проект\", correct: false },\r\n                { text: \"Экспортировать модель в STL\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Какой этап следует выполнить перед добавлением 3D-модели в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Проверка формата и корректности модели\", correct: true },\r\n                { text: \"Создание чертежа\", correct: false },\r\n                { text: \"Запуск симуляции\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Для чего используется вкладка \'Документы\' в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Для привязки чертежей и спецификаций к техпроцессу\", correct: true },\r\n                { text: \"Для редактирования 3D-модели\", correct: false },\r\n                { text: \"Для расчета стоимости\", correct: false },\r\n            ]\r\n        }\r\n    ];\r\n'),
(20, 10, 'Урок 1.2 Наполнение дерева ТП. Создание эскизов обработки', '1.mp4', '- Определение: Дерево ТП — иерархическая структура, отражающая последовательность операций технологического процесса в программе «Вертикаль 2018»\r\n\r\n###Добавление операции в техпроцесс 1. Открыть модуль ТП:\r\n2. Выбрать узел дерева ТП:\r\n- В дереве техпроцесса выберите этап (например, «Черновая обработка»), куда добавляется операция. - Щёлкните правой кнопкой мыши → «Добавить операцию». 3. Заполнить параметры операции:\r\n- Укажите тип операции (например, «Фрезерование», «Сверление»). - Задайте оборудование (станок) и инструмент из справочника. - Введите параметры: режимы резания (скорость, подача), допуски. 4. Привязка детали:\r\n- Если требуется, импортируйте 3D-модель детали (файл .stp) через «Импорт модели». - Свяжите модель с операцией для точного отображения. 5. Сохранить операцию:\r\n- Нажмите «ОК» или «Применить» для сохранения операции в дереве ТП. - Проверьте, что операция отобразилась в дереве.\r\n\r\n#### 2. Подключение эскиза к операции\r\n1. Перейти в модуль эскизов: - В меню программы выберите «Эскизы» или откройте вкладку «Эскизы обработки».\r\n2. Создать новый эскиз: - Нажмите «Создать эскиз» или выберите «Добавить» в интерфейсе. - Выберите операцию, к которой привязывается эскиз, из списка (например, «Фрезерование паза»).\r\n3. Разработать эскиз: - Импортируйте проекцию из 3D-модели (если доступна) через «Импорт вида». - Используйте инструменты 2D-черчения (линии, дуги, размеры) для создания эскиза. - Добавьте аннотации: размеры, допуски, указания по обработке.\r\n4. Настроить параметры эскиза: - Установите масштаб и ориентацию. - Убедитесь, что эскиз понятен (проверьте читаемость текста и линий).\r\n5. Привязать эскиз к операции: - В настройках эскиза выберите нужную операцию из дерева ТП. - Подтвердите привязку через кнопку «Связать» или «Применить».\r\n6. Сохранить и экспортировать: - Сохраните эскиз в проекте. - При необходимости экспортируйте в PDF/DWG через «Файл → Экспорт» для документации.\r\n7. Проверить результат: - Вернитесь в дерево ТП, щёлкните по операции → убедитесь, что эскиз отображается. - Проверьте правильность привязки в предварительном просмотре.\r\n\r\n#### 3. Добавление оснастки\r\n1. Открыть модуль ТП: - В «Вертикаль 2018» перейдите в раздел «Технологический процесс».\r\n2. Выбрать операцию: - В дереве ТП выберите нужную операцию (например, «Фрезерование»).\r\n3. Добавить оснастку: - Щёлкните правой кнопкой мыши на операции → «Добавить оснастку». - Выберите тип оснастки (например, приставка, зажим) из справочника.\r\n4. Настроить параметры: - Укажите модель оснастки, размеры, каталожный номер (если требуется). - Привяжите к станку или детали, если нужно.\r\n5. Сохранить: - Нажмите «ОК» или «Применить» для добавления оснастки к операции.\r\n\r\n#### 4. Добавление режущего инструмента\r\n1. Выбрать операцию: - В дереве ТП выберите операцию, где используется инструмент.\r\n2. Добавить инструмент: - Щёлкните правой кнопкой мыши на операции → «Добавить инструмент». - Из справочника выберите инструмент (например, фреза, сверло).\r\n3. Указать параметры: - Задайте характеристики: диаметр, длина, материал, режимы резания (скорость, подача). - При необходимости добавьте артикул или номер по каталогу.\r\n4. Привязка к операции: - Убедитесь, что инструмент связан с выбранной операцией. - Проверьте совместимость с оснасткой и станком.\r\n5. Сохранить: - Нажмите «ОК» или «Применить» для сохранения инструмента.', '', '\r\n    const questions = [\r\n        {\r\n            question: \"Какой шаг необходим для добавления новой операции в техпроцесс в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Щёлкнуть правой кнопкой мыши на этапе и выбрать \'Добавить операцию\'\", correct: true },\r\n                { text: \"Создать новый проект\", correct: false },\r\n                { text: \"Экспортировать модель в PDF\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Что нужно указать при добавлении операции в техпроцесс?\",\r\n            answers: [\r\n                { text: \"Тип операции, оборудование и параметры обработки\", correct: true },\r\n                { text: \"Только название операции\", correct: false },\r\n                { text: \"Формат экспорта эскиза\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Какой шаг выполняется первым при подключении эскиза к операции?\",\r\n            answers: [\r\n                { text: \"Выбрать операцию в дереве ТП\", correct: true },\r\n                { text: \"Экспортировать эскиз в DWG\", correct: false },\r\n                { text: \"Создать 3D-модель\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Какой формат обычно используется для экспорта эскиза обработки?\",\r\n            answers: [\r\n                { text: \"PDF или DWG\", correct: true },\r\n                { text: \"STL\", correct: false },\r\n                { text: \"TXT\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Где в программе выбирается оснастка для операции?\",\r\n            answers: [\r\n                { text: \"В контекстном меню операции через \'Добавить оснастку\'\", correct: true },\r\n                { text: \"В модуле 3D-моделирования\", correct: false },\r\n                { text: \"В настройках проекта\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Что нужно проверить после добавления режущего инструмента к операции?\",\r\n            answers: [\r\n                { text: \"Совместимость инструмента с оснасткой и станком\", correct: true },\r\n                { text: \"Размер 3D-модели детали\", correct: false },\r\n                { text: \"Формат экспорта чертежа\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Какой модуль используется для создания эскиза обработки в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Эскизы\", correct: true },\r\n                { text: \"Справочник\", correct: false },\r\n                { text: \"Технолог\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Что нужно сделать после создания эскиза для его привязки к операции?\",\r\n            answers: [\r\n                { text: \"Выбрать операцию и нажать \'Связать\'\", correct: true },\r\n                { text: \"Импортировать эскиз в 3D-модель\", correct: false },\r\n                { text: \"Создать новый этап в ТП\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Как добавить режущий инструмент в операцию?\",\r\n            answers: [\r\n                { text: \"Выбрать \'Добавить инструмент\' в контекстном меню операции\", correct: true },\r\n                { text: \"Импортировать инструмент из DWG\", correct: false },\r\n                { text: \"Создать новый эскиз\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Где хранятся данные об оснастке и инструментах в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"В справочнике программы\", correct: true },\r\n                { text: \"В дереве 3D-модели\", correct: false },\r\n                { text: \"В настройках экспорта\", correct: false },\r\n            ]\r\n        }\r\n    ];\r\n'),
(22, 10, 'Урок 1.3 Редактирование операций и переходов', '1.mp4', '###Шаг 1 Добавление размеров в текст перехода\r\n1. Открыть операцию: - В дереве техпроцесса (ТП) выберите нужную операцию.\r\n2. Перейти к переходам: - Щёлкните по операции → откройте вкладку «Переходы» или «Содержание операции».\r\n3. Выбрать или создать переход: - Выберите существующий переход или добавьте новый через «Добавить переход».\r\n4. Редактировать текст перехода: - В поле «Описание перехода» введите текст вручную или выберите шаблон. - Добавьте размеры (например, «Диаметр 50±0.1 мм») в текстовое описание.\r\n5. Использовать справочник (опционально): - Если размеры стандартизированы, выберите их из справочника размеров/допусков. - Вставьте через «Вставить параметр» или аналогичную функцию.\r\n6. Проверить и сохранить: - Убедитесь, что размеры указаны корректно и соответствуют эскизу/чертежу. - Нажмите «ОК» или «Применить» для сохранения изменений.\r\n7. Связать с эскизом (при необходимости): - Если эскиз привязан, проверьте соответствие размеров в эскизе и тексте перехода.\r\n\r\n###Шаг 2 Редактирование формы допуска и расположения в программе «Вертикаль»\r\n1. Открыть параметры допуска: - Щёлкните правой кнопкой мыши на операции → выберите «Редактировать» или «Параметры обработки». - Перейдите во вкладку «Допуски» или «Размеры и допуски».\r\n2. Редактировать форму допуска: - Укажите тип допуска (например, H7, k6) в соответствующем поле. - При необходимости выберите значение из справочника допусков (ISO, ГОСТ).\r\n3. Настроить расположение: - В разделе «Посадки» или «Размещение» задайте параметры (например, зазор, натяг). - Укажите базовые поверхности или оси для привязки расположения.\r\n4. Проверить эскиз: - Если эскиз привязан, откройте его и уточните размеры/допуски через графический редактор. - Подтвердите соответствие допуска и расположения чертежу.', '', '\r\n  const questions = [\r\n    {\r\n      question: \"Как открыть окно редактирования операции в программе Вертикаль 2018?\",\r\n      answers: [\r\n        { text: \"Щёлкнуть правой кнопкой на операции → Редактировать\", correct: true },\r\n        { text: \"Нажать Ctrl+E в дереве техпроцесса\", correct: false },\r\n        { text: \"Выбрать операцию и нажать Файл → Редактировать\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Где задаются параметры допуска в операции?\",\r\n      answers: [\r\n        { text: \"Во вкладке Допуски или Размеры и допуски\", correct: true },\r\n        { text: \"В разделе Режимы обработки\", correct: false },\r\n        { text: \"В справочнике оснастки\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Как добавить новый переход в операцию?\",\r\n      answers: [\r\n        { text: \"Нажать Добавить переход во вкладке Переходы\", correct: true },\r\n        { text: \"Открыть справочник инструментов\", correct: false },\r\n        { text: \"Создать новый эскиз\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Что необходимо проверить перед сохранением изменений в операции?\",\r\n      answers: [\r\n        { text: \"Соответствие размеров чертежу\", correct: true },\r\n        { text: \"Время обработки\", correct: false },\r\n        { text: \"Название операции\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Как связать эскиз с операцией в Вертикаль 2018?\",\r\n      answers: [\r\n        { text: \"Выбрать Связать в меню операции и указать эскиз\", correct: true },\r\n        { text: \"Перетащить эскиз в операцию\", correct: false },\r\n        { text: \"Нажать Ctrl+S в модуле Эскизы\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Где редактируется форма допуска для детали?\",\r\n      answers: [\r\n        { text: \"Во вкладке Допуски или Размеры и допуски\", correct: true },\r\n        { text: \"В модуле Эскизы\", correct: false },\r\n        { text: \"В справочнике инструментов\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Какой инструмент помогает быстро выбрать допуск?\",\r\n      answers: [\r\n        { text: \"Справочник допусков и посадок\", correct: true },\r\n        { text: \"Модуль расчета режимов\", correct: false },\r\n        { text: \"Графический редактор\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Как задать расположение детали в операции?\",\r\n      answers: [\r\n        { text: \"В разделе Посадки или Размещение\", correct: true },\r\n        { text: \"В параметрах перехода\", correct: false },\r\n        { text: \"В настройках инструмента\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Что нужно сделать после редактирования переходов?\",\r\n      answers: [\r\n        { text: \"Нажать ОК или Применить и сохранить проект\", correct: true },\r\n        { text: \"Создать новый техпроцесс\", correct: false },\r\n        { text: \"Перезапустить программу\", correct: false }\r\n      ]\r\n    },\r\n    {\r\n      question: \"Какой элемент нельзя добавить в операцию?\",\r\n      answers: [\r\n        { text: \"Другой техпроцесс\", correct: true },\r\n        { text: \"Переход\", correct: false },\r\n        { text: \"Режущий инструмент\", correct: false }\r\n      ]\r\n    }\r\n  ];\r\n'),
(23, 10, 'Урок 1.4 Библиотека пользователя. Работа со справочникомтехнолога системы ПОЛИНОМ:MDM', '2d2f13e6-11eb-46c7-bf2b-7119bc5deb42.mp4', 'Библиотека пользователя в «Вертикаль 2018» используется для хранения и повторного использования настроенных элементов техпроцесса: операций, переходов, оснастки, инструментов и параметров обработки.\r\n\r\n### 1. Бибилиотека предоставляет следующий функционал\r\n1. Создание шаблонов: Пользователь добавляет типовые операции/переходы в библиотеку для быстрого применения в новых техпроцессах.\r\n2. Доступ к данным: Библиотека открывается через справочник, элементы выбираются для вставки в операцию.\r\n3. Редактирование: Можно добавлять, изменять или удалять элементы в библиотеке.\r\n4. Экономия времени: Повторное использование готовых настроек ускоряет разработку техпроцессов.\r\n5. Стандартизация: Обеспечивает единообразие параметров для однотипных деталей.\r\n\r\n### 2. Выбор режущего инструмента с использованием фильтров\r\n1. Откройте справочник инструментов (в меню операции или через вкладку «Инструменты»).\r\n2. В справочнике нажмите Фильтр (значок воронки или кнопка «Настройка»).\r\n3. Установите параметры фильтра:\r\n- Тип инструмента (фреза, сверло, резец и т.д.).\r\n- Материал обработки (сталь, алюминий, пластик и т.д.).\r\n- Размеры (диаметр, длина, шаг резьбы и т.д.).\r\n- Условия обработки (например, скорость, подача).\r\n- Дополнительные параметры (производитель, серия, стандарт).\r\n4. Примените фильтр (кнопка «ОК» или «Применить»).\r\n5. В отфильтрованном списке выберите подходящий инструмент и добавьте его в операцию (кнопка «Выбрать» или двойной щелчок).', 'Краткое описание', '\r\n    const questions = [\r\n        {\r\n            question: \"Как открыть библиотеку пользователя в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Через вкладку Операции → Добавить\", correct: false },\r\n                { text: \"Через меню Справочники → Библиотека пользователя\", correct: true },\r\n                { text: \"Через настройки проекта\", correct: false }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Что можно сохранить в библиотеку пользователя?\",\r\n            answers: [\r\n                { text: \"3D-модели деталей\", correct: false },\r\n                { text: \"Только чертежи\", correct: false },\r\n                { text: \"Операции, переходы и инструменты\", correct: true }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Как добавить элемент в библиотеку пользователя?\",\r\n            answers: [\r\n                { text: \"Выбрать элемент и нажать Сохранить в библиотеку\", correct: true },\r\n                { text: \"Экспортировать в DXF\", correct: false },\r\n                { text: \"Создать новый техпроцесс\", correct: false }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Где хранятся данные справочника технолога в ПОЛИНОМ:MDM?\",\r\n            answers: [\r\n\r\n                { text: \"В локальных файлах проекта\", correct: false },\r\n                { text: \"На внешнем сервере\", correct: false },\r\n                { text: \"В единой базе данных системы\", correct: true }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Какой функционал справочника технолога в ПОЛИНОМ:MDM ускоряет выбор инструмента?\",\r\n            answers: [\r\n                { text: \"Фильтры по типу, материалу и параметрам\", correct: true },\r\n                { text: \"Автоматическая генерация операций\", correct: false },\r\n                { text: \"Импорт чертежей\", correct: false }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Как импортировать техпроцесс из библиотеки пользователя в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Открыть файл через меню Файл → Импорт\", correct: false },\r\n                { text: \"Выбрать техпроцесс в справочнике и нажать Вставить\", correct: true },\r\n                { text: \"Создать новый чертеж\", correct: false }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Какой тип файла обычно используется для подключения 3D-модели в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"STEP (.stp)\", correct: true },\r\n                { text: \"PDF (.pdf)\", correct: false },\r\n                { text: \"TXT (.txt)\", correct: false }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Как называется модуль в Вертикаль 2018 для создания техпроцесса?\",\r\n            answers: [\r\n                { text: \"Технолог\", correct: true },\r\n                { text: \"Конструктор\", correct: false },\r\n                { text: \"Архиватор\", correct: false }\r\n            ]\r\n        },\r\n        {\r\n            question: \"Что необходимо сделать для подключения чертежа в техпроцесс?\",\r\n            answers: [\r\n                { text: \"Экспортировать модель в STL\", correct: false },\r\n                { text: \"Импортировать файл в формате DWG/DXF\", correct: true },\r\n                { text: \"Создать новый проект\", correct: false },\r\n            ]\r\n        },\r\n        {\r\n            question: \"Для чего используется вкладка \'Документы\' в Вертикаль 2018?\",\r\n            answers: [\r\n                { text: \"Для редактирования 3D-модели\", correct: false },\r\n                { text: \"Для расчета стоимости\", correct: false },\r\n                { text: \"Для привязки чертежей и спецификаций к техпроцессу\", correct: true }\r\n            ]\r\n        }\r\n    ];\r\n');

-- --------------------------------------------------------

--
-- Структура таблицы `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `modules`
--

INSERT INTO `modules` (`id`, `course_id`, `slug`, `title`, `status`) VALUES
(3, 2, 'project-management', 'Введение в управление проектами', 'INACTIVE'),
(10, 18, 'vertikal-2018-sp1', 'Вертикаль 2018 SP.1', 'ACTIVE');

-- --------------------------------------------------------

--
-- Структура таблицы `offers`
--

CREATE TABLE `offers` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `response` text DEFAULT NULL,
  `status` tinytext NOT NULL DEFAULT 'В ожидании рассмотрения',
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `offers`
--

INSERT INTO `offers` (`id`, `user_id`, `topic`, `description`, `response`, `status`, `created_at`, `updated_at`) VALUES
(15, 54, 'Вопрос с курсами', 'Запишите меня хотя бы на какой нибудь курс. А то нахуя я сюда зашел', 'Потому что потому', 'APPROVED', '2025-08-25 09:40:21.000000', '2025-08-25 11:49:28.000000'),
(16, 31, 'Модули управления проектами', 'Прошу добавить еще пару модулей для лучшего изучения материала', 'Да иди нахуй со своими просьбами', 'REJECTED', '2025-08-27 08:10:29.000000', '2025-09-03 13:47:36.000000'),
(19, 56, 'Курсы', 'Прошу записать меня на курс Инженер технолог БРиНТ', 'Мы пока не умеем записывать пользователей на курсы :( сорян', 'REJECTED', '2025-09-03 11:56:02.000000', '2025-09-03 13:46:57.000000');

-- --------------------------------------------------------

--
-- Структура таблицы `offers_seq`
--

CREATE TABLE `offers_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `offers_seq`
--

INSERT INTO `offers_seq` (`next_val`) VALUES
(151);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `department` varchar(50) NOT NULL,
  `job_title` varchar(50) NOT NULL,
  `qualification` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(200) NOT NULL DEFAULT 'avatar.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `department`, `job_title`, `qualification`, `username`, `password`, `avatar`, `created_at`, `updated_at`) VALUES
(31, 'Никита', 'Бугаков', 'ОГТ', 'Программист', '1', 'bugakov', '$2a$10$KB4MinEXC1xxG6FP.Nxd6uEmjBp2AGK6EW.PiHGe2pbCczANsAkNm', '47571d78-360e-496e-98d8-2f39af343df0.jfif', '2025-08-19 08:30:03', '2025-08-26 05:35:54'),
(32, 'Администратор', 'Администратор', 'ОГТ', 'Программист', '1', 'admin123', '$2a$10$DF6W1QYHG7Ofzgx/RgtZuejx3DKVYEcX.ZbScmx7luR6IXbkPvVSO', 'avatar.png', '2025-08-21 05:14:42', '2025-08-26 05:35:56'),
(54, 'Данек', 'Сморчков', 'ОТК', 'Дефектоскопист', '1', 'danek123', '$2a$10$hlwpXRf/pFpL6MRYZNChe.LSg78k3MPJxZ9oihkwj10trPK89byAC', 'avatar.png', '2025-08-21 09:46:24', '2025-08-26 05:35:58'),
(55, 'Серега', 'Петенков', 'ОТК', 'Начальник', '1', 'petenkov123', '$2a$10$.TBxd8Hv0vsfZ6JqVoXbQewWtTOYFtjtGy.48TyhW.Fw5G2z/5zcm', 'avatar.png', '2025-09-03 05:50:52', '2025-09-03 08:54:55'),
(56, 'Амир', 'Сарипов', 'ОТК', 'Зам. начальника', '2', 'amirka', '$2a$10$OEm1ANcYEg1z/56cIgLBBuAxCrACoq/shVuKf99zz/OhW8F//pR1e', '52cec427-3bf3-4286-b739-a5dbad2ac46c.jfif', '2025-09-03 05:54:29', '2025-09-03 05:54:29');

-- --------------------------------------------------------

--
-- Структура таблицы `user_courses`
--

CREATE TABLE `user_courses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_courses`
--

INSERT INTO `user_courses` (`id`, `user_id`, `course_id`, `enrolled_at`) VALUES
(4, 31, 2, '2025-08-26 12:12:28'),
(6, 31, 18, '2025-09-03 12:20:08');

-- --------------------------------------------------------

--
-- Структура таблицы `user_courses_seq`
--

CREATE TABLE `user_courses_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_courses_seq`
--

INSERT INTO `user_courses_seq` (`next_val`) VALUES
(1);

-- --------------------------------------------------------

--
-- Структура таблицы `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_id`, `course_id`, `module_id`, `lesson_id`, `completed_at`) VALUES
(13, 31, 18, 10, 20, '2025-09-03 08:17:37');

-- --------------------------------------------------------

--
-- Структура таблицы `user_role`
--

CREATE TABLE `user_role` (
  `id` int(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  `roles` enum('ROLE_ADMIN','ROLE_USER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_role`
--

INSERT INTO `user_role` (`id`, `user_id`, `roles`) VALUES
(4, 31, 'ROLE_USER'),
(35, 32, 'ROLE_ADMIN'),
(38, 54, 'ROLE_USER'),
(39, 55, 'ROLE_USER'),
(41, 56, 'ROLE_USER');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Индексы таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `module_id` (`module_id`);

--
-- Индексы таблицы `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Индексы таблицы `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Индексы таблицы `user_courses`
--
ALTER TABLE `user_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_course` (`user_id`,`course_id`),
  ADD KEY `fk_user_courses_course` (`course_id`);

--
-- Индексы таблицы `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Индексы таблицы `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKj345gk1bovqvfame88rcx7yyx` (`user_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT для таблицы `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `offers`
--
ALTER TABLE `offers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT для таблицы `user_courses`
--
ALTER TABLE `user_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_courses`
--
ALTER TABLE `user_courses`
  ADD CONSTRAINT `fk_user_courses_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_courses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_3` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_4` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
