FROM node
ENV MONKEY_VERSION=0.0.23
RUN npm install -g monkey-typescript@${MONKEY_VERSION}
ENTRYPOINT ["monkey-typescript"]