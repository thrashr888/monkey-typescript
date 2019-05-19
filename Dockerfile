FROM node
ENV MONKEY_VERSION=0.0.24
RUN npm install -g monkey-typescript@${MONKEY_VERSION}
ENTRYPOINT ["monkey-typescript"]