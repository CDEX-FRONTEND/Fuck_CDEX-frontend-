config-docker:
	@if test ! -f ./.env ; then cp ./.env.docker ./.env ; fi

config-stand:
	@if test ! -f ./.env ; then cp ./.env.stand ./.env ; fi

ports:
	docker ps --format="table {{.Names}}\t{{.Ports}}"
