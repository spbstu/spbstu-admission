# Приложение для вывода информации о ходе приёмной кампании в СПбПУ Петра Великого

[![Build Status](https://travis-ci.org/spbstu/spbstu-admission.svg?branch=master)](https://travis-ci.org/spbstu/spbstu-admission)

## Зависимости

1. Node.js >= 0.1.35 
1. Meteor >= 1.3
1. MongoDB
1. Веб-сервер с поддержкой websocket

## Структура репозитория

```
build  — служебный каталог для результатов сборки
src    – исходный код проекта
tools  — файлы, необходимые для запуска production-версии
```

## Установка и запуск dev-версии

1. Установить meteor (см. https://www.meteor.com/install)
1. Перейти в каталог `./src`
1. Выполнить `$ meteor`

### Дополнительные команды

* `$ meteor reset` — сброс проекта к начальному состоянию
* `$ meteor mongo` — вызов cli к mongodb с настроенными параметрами окружения

## Запуск на production

1. Установить `mongodb`, `nodejs`, `python >= 2.7`, `make`, `g++`
1. Скопировать и разврнуть пакет с релизом. См. `tools/update.sh`
1. Установить параметры окружения и запустить приложение. См. `tools/run.sh`
 