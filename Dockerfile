FROM mhart/alpine-node:12

WORKDIR /src
ENV PATH /src:$PATH

ENV MONKEY_VERSION=0.1.4
RUN npm install -g monkey-typescript@${MONKEY_VERSION}
ENTRYPOINT ["monkey-typescript"]